package logic

import (
	"context"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type DeleteModuleLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteModuleLogic(ctx context.Context, svcCtx *svc.ServiceContext) DeleteModuleLogic {
	return DeleteModuleLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteModuleLogic) DeleteModule(req types.DeleteModuleRequest, userId int64) error {
	return l.svcCtx.ModuleModel.Delete(req.Id)
}
