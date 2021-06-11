package logic

import (
	"context"
	"database/sql"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type DeleteTraceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteTraceLogic(ctx context.Context, svcCtx *svc.ServiceContext) DeleteTraceLogic {
	return DeleteTraceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteTraceLogic) DeleteTrace(req types.DeleteTraceRequest) error {
	info := model.TraceVisualElementInfo{
		ComponentName: req.ComponentName,
		Path:          sql.NullString{String: req.Path, Valid: true},
		IsPage:        0,
		AppId:         types.ProjectXbh,
		Platform:      req.Platform,
		Version:       req.Version,
	}
	if req.IsAllVersion {
		info.Version = ``
	}
	return l.svcCtx.ElementInfoModel.DeleteByElementInfo(info)
}
