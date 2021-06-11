package logic

import (
	"context"
	"encoding/json"
	"sort"
	"strings"
	"unicode/utf8"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type QueryPageDetailLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewQueryPageDetailLogic(ctx context.Context, svcCtx *svc.ServiceContext) QueryPageDetailLogic {
	return QueryPageDetailLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *QueryPageDetailLogic) QueryPageDetail(req types.QueryPageDetailRequest) (*types.QueryPageDetailResponse, error) {
	androidIOS, err := l.svcCtx.ElementInfoModel.QueryTwoPagesByPageGroupId(req.PageGroupId)
	if err != nil {
		return nil, err
	}
	response := types.QueryPageDetailResponse{
		AndroidElements: map[string]*types.ElementTree{},
		IOSElements:     map[string]*types.ElementTree{},
		AndroidPageInfo: map[string]*types.PageTraceInfo{},
		IOSPageInfo:     map[string]*types.PageTraceInfo{},
	}
	for _, temp := range androidIOS {
		item := temp
		traces, err := l.svcCtx.ElementInfoModel.QueryByPageId(item.PageId, item.Platform)
		if err != nil {
			return nil, err
		}

		versionMap := groupByVersion(traces)
		for version, v := range versionMap {
			tree, err := toTree(v, item.Platform)
			reduceTree(tree, nil, 0)
			if err != nil {
				return nil, err
			}
			if item.Platform == types.AndroidPlatform {
				response.AndroidElements[version] = tree
				response.AndroidId = int(item.Id)
			}
			if item.Platform == types.IOSPlatform {
				response.IOSElements[version] = tree
				response.IOSId = int(item.Id)
			}
		}
		multiVersionPage, err := queryMultiVersionPage(
			item.PageId,
			item.Platform,
			item.AppId,
			l.svcCtx.ElementInfoModel)
		if err != nil {
			return nil, err
		}
		if item.Platform == types.AndroidPlatform {
			response.AndroidPageInfo = multiVersionPage
			buildEmptyTree(multiVersionPage, response.AndroidElements)
		}
		if item.Platform == types.IOSPlatform {
			response.IOSPageInfo = multiVersionPage
			buildEmptyTree(multiVersionPage, response.IOSElements)
		}
	}

	return &response, nil
}

func buildEmptyTree(pages map[string]*types.PageTraceInfo, elements map[string]*types.ElementTree) {
	for version := range pages {
		_, ok := elements[version]
		if !ok {
			elements[version] = &types.ElementTree{SubPath: "root"}
		}
	}

}

func queryMultiVersionPage(pageId, platform, appId string, elementModel model.ElementInfoModel) (map[string]*types.PageTraceInfo, error) {
	versionPages, err := elementModel.QueryMultiVersionPage(pageId, platform, appId)
	if err != nil {
		return nil, err
	}
	m := map[string]*types.PageTraceInfo{}
	for i := range versionPages {
		item := versionPages[i]
		m[item.Version] = &types.PageTraceInfo{
			PageId:        item.PageId,
			PageName:      item.PageName.String,
			ComponentName: item.ComponentName,
			Id:            item.Id,
			Picture:       item.Picture,
		}
	}
	return m, nil
}

func groupByVersion(traces []*model.PageItemDetailItem) map[string][]*model.PageItemDetailItem {
	m := make(map[string][]*model.PageItemDetailItem)
	for i := range traces {
		item := traces[i]
		items, ok := m[item.Version]
		if !ok {
			items = []*model.PageItemDetailItem{}
			m[item.Version] = items
		}
		m[item.Version] = append(m[item.Version], item)
	}
	return m
}

func splitPath(platform, path string) []string {
	path = strings.Trim(path, types.AndroidSep)
	path = strings.Trim(path, types.IOSSep)
	path = strings.ReplaceAll(path, "//", "/")
	if platform == types.AndroidPlatform {
		result := []string{}
		for _, subPath := range strings.Split(path, `#`) {
			result = append(result, strings.Split(subPath, `/`)...)
		}
		return result
	} else if platform == types.IOSPlatform {
		return strings.Split(path, types.IOSSep)
	} else {
		return nil
	}
}

func toTree(traces []*model.PageItemDetailItem, platform string) (*types.ElementTree, error) {
	tree := &types.ElementTree{SubPath: "root"}
	sort.Slice(traces, func(i, j int) bool {
		return utf8.RuneCountInString(traces[i].Path.String) < utf8.RuneCountInString(traces[j].Path.String)
	})
	for _, temp := range traces {
		item := temp
		tempElement := tree
		paths := splitPath(platform, item.Path.String)
		for j, subPath := range paths {
			if j == len(paths)-1 {
				newItem := &types.ElementTree{SubPath: subPath}
				tempElement.Children = append(tempElement.Children, newItem)
				newItem.Path = item.Path.String
				newItem.ComponentName = item.ComponentName
				newItem.Id = int(item.Id)
				newItem.Picture = item.Picture
				newItem.TraceName = item.TraceName.String
				newItem.TraceType = item.TraceType.String
				newItem.FullPicture = item.FullPicture
				position := types.Position{}
				if item.Position.Valid {
					if err := json.Unmarshal([]byte(item.Position.String), &position); err != nil {
						return nil, err
					}
				}
				newItem.Position = &position
			} else {
				if len(tempElement.Children) == 0 {
					tempElement.Children = []*types.ElementTree{}
				}
				hasSameSubPath := false
				for _, tempChild := range tempElement.Children {
					child := tempChild
					if child.SubPath == subPath {
						hasSameSubPath = true
						tempElement = child
						break
					}
				}
				if !hasSameSubPath {
					newItem := &types.ElementTree{SubPath: subPath}
					tempElement.Children = append(tempElement.Children, newItem)
					tempElement = newItem
				}
			}
		}
	}
	return tree, nil
}

func reduceTree(tree *types.ElementTree, parentNode *types.ElementTree, idx int) {
	if parentNode == nil {
		for i := range tree.Children {
			reduceTree(tree.Children[i], tree, i)
		}
	} else {
		length := len(tree.Children)
		switch length {
		case 0:
			return
		case 1:
			if len(parentNode.Children) == 1 && tree.Path == "" {
				parentNode.Children = []*types.ElementTree{tree.Children[0]}
				reduceTree(parentNode.Children[0], parentNode, idx)
			} else {
				reduceTree(tree.Children[0], tree, 0)
			}
		default:
			for i := range tree.Children {
				reduceTree(tree.Children[i], tree, i)
			}
		}
	}
}
