package logic

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	_ "image/jpeg"
	"strings"
	"unicode/utf8"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/oss"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"
	"tracking/cmd/api/internal/util"

	alioss "github.com/aliyun/aliyun-oss-go-sdk/oss"
	"github.com/tal-tech/go-zero/core/logx"
)

type AddElementLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewAddElementLogic(ctx context.Context, svcCtx *svc.ServiceContext) AddElementLogic {
	return AddElementLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *AddElementLogic) AddElement(req types.AddElementRequest, userId string) error {
	elementInfo := model.TraceVisualElementInfo{}

	pageId, err := ParsePageId(req.ComponentName, req.Platform, req.PageTitle)
	if err != nil {
		return err
	}
	elementInfo.PageId = pageId
	page := req.IsPage
	if page {
		elementInfo.IsPage = 1
		elementInfo.PageName = sql.NullString{String: pageId, Valid: true}
	} else {
		elementInfo.IsPage = 0

		hasPage, _, err := l.svcCtx.ElementInfoModel.Has(model.TraceVisualElementInfo{
			IsPage:   1,
			AppId:    req.AppId,
			Platform: req.Platform,
			Version:  req.Version,
			PageId:   pageId,
		})
		if err != nil {
			return err
		}
		if !hasPage {
			return errors.New(fmt.Sprintf("页面 : '%s' 在数据库中不存在", elementInfo.PageId))
		}

		positionBytes, err := json.Marshal(req.Position)
		if err != nil {
			return err
		}
		elementInfo.Position = sql.NullString{String: string(positionBytes), Valid: true}
		elementInfo.Path = sql.NullString{String: req.Path, Valid: true}
		elementInfo.TraceName = sql.NullString{String: cutString(req.Name, 100), Valid: true}
	}
	elementInfo.PageTitle = req.PageTitle
	elementInfo.ComponentName = req.ComponentName
	elementInfo.Version = req.Version
	elementInfo.AppId = req.AppId
	elementInfo.Platform = req.Platform
	elementInfo.Creator = userId

	has, oldElement, err := l.svcCtx.ElementInfoModel.Has(elementInfo)
	if err != nil {
		return err
	}
	if has {
		if req.IsOverride {
			if err := updateElement(oldElement, req, l.svcCtx); err != nil {
				return err
			}
			if req.IsPage && !oldElement.AndroidIosRelation.Valid {
				l.svcCtx.PageMatchChan <- oldElement.Id
			}
			return nil
		} else {
			return errors.New("页面或元素以存在")
		}
	}

	var previousPage *model.TraceVisualElementInfo
	if page {
		previousPage, err = copyPreviousPage(&elementInfo, l.svcCtx.ElementInfoModel)
		if err != nil {
			return err
		}
	}

	picURL, err := uploadImg(req.Picture, l.svcCtx.Config.OssDownLoadUrl, l.svcCtx.Bucket)
	if err != nil {
		return err
	}
	elementInfo.Picture = picURL

	if !page {
		fullPicURL, err := uploadImg(req.FullPicture, l.svcCtx.Config.OssDownLoadUrl, l.svcCtx.Bucket)
		if err != nil {
			return err
		}
		elementInfo.FullPicture = fullPicURL

	}
	insertResult, err := l.svcCtx.ElementInfoModel.Insert(elementInfo)
	if err != nil {
		return err
	}
	if page {
		insertId, err := insertResult.LastInsertId()
		if err != nil {
			return err
		}
		if previousPage == nil {
			l.svcCtx.PageMatchChan <- insertId
		} else {
			if !previousPage.AndroidIosRelation.Valid {
				l.svcCtx.PageMatchChan <- insertId
			}
		}
	}

	return nil
}

func updateElement(oldElement *model.TraceVisualElementInfo, req types.AddElementRequest, ctx *svc.ServiceContext) error {

	picURL, err := uploadImg(req.Picture, ctx.Config.OssDownLoadUrl, ctx.Bucket)
	if err != nil {
		return err
	}
	if !req.IsPage {

		fullPicURL, err := uploadImg(req.FullPicture, ctx.Config.OssDownLoadUrl, ctx.Bucket)
		if err != nil {
			return err
		}
		positionBytes, err := json.Marshal(req.Position)
		if err != nil {
			return err
		}

		oldElement.Position = sql.NullString{String: string(positionBytes), Valid: true}
		oldElement.FullPicture = fullPicURL
		oldElement.TraceName = sql.NullString{String: req.Name, Valid: true}
	}
	oldElement.Picture = picURL
	return ctx.ElementInfoModel.Update(*oldElement)
}

func cutString(str string, maxLen int) string {
	if utf8.RuneCountInString(str) <= maxLen {
		return str
	}
	runeStr := []rune(str)
	return string(runeStr[:maxLen])
}

func uploadImg(imgBase64, host string, bucket *alioss.Bucket) (picURL string, _ error) {
	byteImg, _, err := parserImg(imgBase64)
	if err != nil {
		return "", err
	}
	objKey, err := oss.Upload(bucket, byteImg)
	if err != nil {
		return "", errors.New("upload to oss error:" + err.Error())
	}
	return host + "/" + objKey, nil
}

func parserImg(imgBase64 string) ([]byte, string, error) {
	byteImg, err := base64.StdEncoding.DecodeString(imgBase64)
	if err != nil {
		errMsg := fmt.Sprintf("图片base64解析错误:[%v]\n", err)
		logx.Error(errMsg)
		return nil, "", errors.New(errMsg)
	}
	return byteImg, "", nil
}

func copyPreviousPage(currentPage *model.TraceVisualElementInfo, elementModel model.ElementInfoModel) (previousPage *model.TraceVisualElementInfo, _ error) {
	previousPage, err := elementModel.FindPreviousPageVersion(currentPage.PageId, currentPage.Platform, currentPage.Version)
	if err != nil {
		return nil, err
	}
	if previousPage == nil {
		currentPage.PageGroupId = util.ShortUUID()
		return nil, nil
	}
	currentPage.AndroidIosRelation = previousPage.AndroidIosRelation
	currentPage.PageName = previousPage.PageName
	currentPage.PageGroupId = previousPage.PageGroupId
	currentPage.PageModuleId = previousPage.PageModuleId
	return previousPage, nil
}

func ParsePageId(componentName, platform, pageTitle string) (pageId string, _ error) {
	pageId = ""
	defer func() {
		if pageTitle != "" && pageId != "" {
			pageId += "_" + pageTitle
		}
	}()
	if componentName == "" {
		return "", errors.New("componentName is empty")
	}
	if platform == types.AndroidPlatform {
		pageId = parseAndroidPageId(componentName)
		return pageId, nil
	} else if platform == types.IOSPlatform {
		pageId = parseIOSPageId(componentName)
		return pageId, nil
	} else {
		return "", errors.New("不支持的平台")
	}
}

func parseIOSPageId(componentName string) string {
	splits := strings.Split(componentName, `#`)
	return splits[0]
}

func parseAndroidPageId(componentName string) string {
	splits := strings.Split(componentName, `#`)
	return splits[0]
}
