package logic

import (
	"context"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type UpdatePageModuleIdLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdatePageModuleIdLogic(ctx context.Context, svcCtx *svc.ServiceContext) UpdatePageModuleIdLogic {
	return UpdatePageModuleIdLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdatePageModuleIdLogic) UpdatePageModuleId(req types.UpdatePageModuleIdRequest) error {
	one, err := l.svcCtx.ElementInfoModel.FindOneByPageGroupId(req.PageGroupId)
	if err != nil {
		return err
	}

	if one.PageModuleId.Int64 == int64(req.PageModuleId) {
		return nil
	}

	return l.svcCtx.ElementInfoModel.UpdatePageModuleIdByPageGroupId(int64(req.PageModuleId), one.PageModuleId.Int64, req.PageGroupId)
}
