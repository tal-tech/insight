package logic

import (
	"context"
	"database/sql"
	"strings"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type QueryRelatedPageLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewQueryRelatedPageLogic(ctx context.Context, svcCtx *svc.ServiceContext) QueryRelatedPageLogic {
	return QueryRelatedPageLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *QueryRelatedPageLogic) QueryRelatedPage(req types.QueryRelatedPageRequest) (*types.QueryRelatedPageResponse, error) {
	return QueryRelatedPageTrue(l, req)
}

func QueryRelatedPageTrue(l *QueryRelatedPageLogic, req types.QueryRelatedPageRequest) (*types.QueryRelatedPageResponse, error) {
	one, err := l.svcCtx.ElementInfoModel.FindOne(int64(req.Id))
	empty := types.QueryRelatedPageResponse{Pages: []*types.WebQueryPageItem{}}
	if err != nil {
		if err == sql.ErrNoRows {
			return &empty, nil
		}
		return nil, err
	}
	one.Version = cutVersion(one.Version)
	relatedPages, err := l.svcCtx.RelatedPageModel.QueryRelatedPage(one.Platform, one.Version, one.PageId)
	if err != nil {
		if err == sql.ErrNoRows {
			return &empty, nil
		}
		return nil, err
	}
	if relatedPages == "" {
		return &empty, nil
	}
	pages, err := l.svcCtx.ElementInfoModel.QueryPageListByComponetName(strings.Split(relatedPages, `,`), one.Platform, req.CurrentPage, req.PageSize, one.Version)
	if err != nil {
		if err == sql.ErrNoRows {
			return &empty, nil
		}
		return nil, err
	}
	result := []*types.WebQueryPageItem{}
	for i := range pages {
		item := pages[i]
		result = append(result, &types.WebQueryPageItem{
			Platform:       item.Platform,
			PageUrl:        item.Picture,
			PageName:       item.PageName.String,
			PageModuleName: item.ModuleName.String,
			PageId:         item.PageId,
			// Id:             item.Id,
			PageGroupId: item.PageGroupId,
		})
	}

	return &types.QueryRelatedPageResponse{Pages: result}, nil
}

func cutVersion(version string) string {
	idx := strings.LastIndex(version, ".")
	return version[:idx]
}
