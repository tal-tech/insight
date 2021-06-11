package logic

import (
	"context"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type QueryModuleListLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewQueryModuleListLogic(ctx context.Context, svcCtx *svc.ServiceContext) QueryModuleListLogic {
	return QueryModuleListLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *QueryModuleListLogic) QueryModuleList(req types.QueryModuleListRequest, userId int64) (*types.QueryModuleListResponse, error) {
	temp, err := l.svcCtx.ModuleModel.QueryModuleList(req)
	if err != nil {
		return nil, err
	}

	var result []*types.Module
	for _, data := range temp {
		module := &types.Module{
			Id:         data.Id,
			ModuleName: data.ModuleName,
		}
		result = append(result, module)
	}

	return &types.QueryModuleListResponse{
		ModuleList: result,
	}, nil
}
