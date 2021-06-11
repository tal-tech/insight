package logic

import (
	"context"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
	"github.com/thoas/go-funk"
)

type UpdatePageOrderLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdatePageOrderLogic(ctx context.Context, svcCtx *svc.ServiceContext) UpdatePageOrderLogic {
	return UpdatePageOrderLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdatePageOrderLogic) UpdatePageOrder(req types.UpdatePageOrderRequest) error {
	ids := funk.UniqString(req.PageGroupIds)
	one, err := l.svcCtx.ModuleModel.FindOne(req.ModuleId)
	if err != nil {
		return err
	}
	str := ""
	for _, item := range ids {
		str += item + ","
	}
	one.PageOrder.String = repacePrefix(str, one.PageOrder.String)
	one.PageOrder.Valid = true
	return l.svcCtx.ModuleModel.Update(*one)
}

func repacePrefix(prefix, fullStr string) string {
	strRune := []rune(prefix)
	originRune := []rune(fullStr)
	return string(strRune) + string(originRune[len(strRune):])
}
