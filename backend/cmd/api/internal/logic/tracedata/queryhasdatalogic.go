package logic

import (
	"context"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type QueryHasDataLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewQueryHasDataLogic(ctx context.Context, svcCtx *svc.ServiceContext) QueryHasDataLogic {
	return QueryHasDataLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *QueryHasDataLogic) QueryHasData(req types.QueryHasDataRequest) (*types.QueryHasDataResponse, error) {
	one, err := l.svcCtx.ElementInfoModel.FindOne(int64(req.Id))
	if err != nil {
		return nil, err
	}
	b, err := l.svcCtx.TraceDataModel.QueryHasData(one.ComponentName, one.Path.String, one.Platform, one.Version)
	if err != nil {
		return nil, err
	}

	return &types.QueryHasDataResponse{Has: b}, nil
}
