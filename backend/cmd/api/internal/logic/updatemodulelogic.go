package logic

import (
	"context"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type UpdateModuleLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateModuleLogic(ctx context.Context, svcCtx *svc.ServiceContext) UpdateModuleLogic {
	return UpdateModuleLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateModuleLogic) UpdateModule(req types.UpdateModuleRequest) error {
	module, err := l.svcCtx.ModuleModel.FindOne(req.ModuleId)
	if err != nil {
		return err
	}
	module.ModuleName = req.ModuleName
	return l.svcCtx.ModuleModel.Update(*module)
}
