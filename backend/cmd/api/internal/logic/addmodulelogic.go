package logic

import (
	"context"
	"errors"
	"strings"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type AddModuleLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

const (
	ErrorDuplicatePrefix = "Error 1062"

	OrderByFlag = 1
)

func NewAddModuleLogic(ctx context.Context, svcCtx *svc.ServiceContext) AddModuleLogic {
	return AddModuleLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *AddModuleLogic) AddModule(req types.AddModuleRequest, userId int64) error {
	module := model.Module{
		ModuleName: req.ModuleName,
		CreateBy:   userId,
		UpdateBy:   userId,
		Model:      OrderByFlag,
	}
	_, err := l.svcCtx.ModuleModel.Insert(module)
	if err != nil {
		if strings.HasPrefix(err.Error(), ErrorDuplicatePrefix) {
			return errors.New("该模块已经存在,请重新输入")
		}
		return err
	}

	return nil
}
