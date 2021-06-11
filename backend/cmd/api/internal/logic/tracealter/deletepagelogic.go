package logic

import (
	"context"
	"errors"
	"strings"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
)

type DeletePageLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeletePageLogic(ctx context.Context, svcCtx *svc.ServiceContext) DeletePageLogic {
	return DeletePageLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeletePageLogic) DeletePage(req types.DeletePageRequest) error {
	// 验证页面是否解绑了
	pages, err := l.svcCtx.ElementInfoModel.QueryMultiVersionPage(req.PageId, req.Platform, types.ProjectXbh)
	if err != nil {
		return err
	}
	var needDeletePage *model.TraceVisualElementInfo
	for _, page := range pages {
		if page.Version == req.Version {
			needDeletePage = page
			break
		}
	}
	if needDeletePage == nil {
		return errors.New("没找到该页面")
	}
	if needDeletePage.AndroidIosRelation.Valid {
		return errors.New("解绑才能删除页面")
	}

	// 如果只有一个页面,并且有 moduleId。那就需要修改 module 表
	needAlterModule := len(pages) == 1 && needDeletePage.PageModuleId.Int64 != 0
	logx.Info("需要修改 module:", needAlterModule)
	var pageOrder string
	if needAlterModule {
		module, err := l.svcCtx.ModuleModel.FindOne(int(needDeletePage.PageModuleId.Int64))
		if err != nil {
			return nil
		}
		pageOrder = strings.ReplaceAll(module.PageOrder.String, needDeletePage.PageGroupId+`,`, ``)
	}

	return l.svcCtx.MysqlConn.Transact(func(session sqlx.Session) error {
		// 删除页面
		if _, err := session.Exec(`delete from element_info where id = ?`, needDeletePage.Id); err != nil {
			return err
		}
		// 删除页面内的元素
		if _, err := session.Exec(`delete from element_info where page_id = ? and version = ? and platform = ? and is_page = 0`, needDeletePage.PageId, req.Version, req.Platform); err != nil {
			return err
		}

		if !needAlterModule {
			return nil
		}
		_, err := session.Exec(`update module set page_order = ? where id = ?`, pageOrder, needDeletePage.PageModuleId.Int64)
		return err
	})

}
