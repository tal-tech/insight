package logic

import (
	"context"
	"errors"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type UpdatePageNameLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdatePageNameLogic(ctx context.Context, svcCtx *svc.ServiceContext) UpdatePageNameLogic {
	return UpdatePageNameLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdatePageNameLogic) UpdatePageName(req types.UpdatePageNameRequest) error {
	b, err := l.svcCtx.ElementInfoModel.CheckPageNameHasSame(req.PageName, []int64{})
	if err != nil {
		return err
	}
	if b {
		return errors.New("已存在相同的页面名称")
	}

	return l.svcCtx.ElementInfoModel.UpdatePageNameByPageGroupId(req.PageName, req.PageGroupId)
}
