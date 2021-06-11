package logic

import (
	"context"
	"encoding/json"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type AppQueryElementLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
	model  model.ElementInfoModel
}

func NewAppQueryElementLogic(ctx context.Context, svcCtx *svc.ServiceContext) AppQueryElementLogic {
	return AppQueryElementLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
		model:  model.NewElementInfoModel(svcCtx.MysqlConn, nil),
	}
}

func (l *AppQueryElementLogic) AppQueryElement(req types.AppQueryListRequest) (*types.AppQueryListResponse, error) {
	dbResult, err := l.model.AppQueryList(req.AppId, req.Platform, req.Version)
	if err != nil {
		return nil, err
	}
	result := types.AppQueryListResponse{Items: []*types.AppQueryResponseItem{}}
	for _, temp := range dbResult {
		item := temp

		isPage := false
		if item.IsPage == 1 {
			isPage = true
		}
		var p *types.Position
		if !isPage {
			p = &types.Position{}
			if err := json.Unmarshal([]byte(item.Position.String), p); err != nil {
				return nil, err
			}
		}
		result.Items = append(result.Items, &types.AppQueryResponseItem{
			IsPage:        isPage,
			ComponentName: item.ComponentName,
			Path:          item.Path.String,
			Position:      p,
			Name:          item.TraceName.String,
		})
	}
	return &result, nil
}
