package logic

import (
	"context"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type UpdateElementLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateElementLogic(ctx context.Context, svcCtx *svc.ServiceContext) UpdateElementLogic {
	return UpdateElementLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateElementLogic) UpdateElement(req types.UpdateElementRequest) error {
	one, err := l.svcCtx.ElementInfoModel.FindOne(int64(req.Id))
	if err != nil {
		return err
	}

	if req.TraceName != nil && *req.TraceName != "" {
		one.TraceName.Valid = true
		one.TraceName.String = *req.TraceName
	}
	return l.svcCtx.ElementInfoModel.Update(*one)
}
