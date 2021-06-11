package logic

import (
	"context"
	"database/sql"
	"errors"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

type QueryTraceGroupLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewQueryTraceGroupLogic(ctx context.Context, svcCtx *svc.ServiceContext) QueryTraceGroupLogic {
	return QueryTraceGroupLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *QueryTraceGroupLogic) QueryTraceGroup(req types.QueryTraceGroupRequest) (*types.QueryTraceGroupResoponse, error) {
	one, err := l.svcCtx.ElementInfoModel.FindOne(int64(req.Id))
	if err != nil {
		if err == sql.ErrNoRows {
			return &types.QueryTraceGroupResoponse{
				GroupId: "",
				Groups:  map[string]string{},
			}, nil
		}
		return nil, err
	}
	if one.IsPage == 1 {
		return nil, errors.New("改元素是页面")
	}

	groupId := ""
	groups, err := l.svcCtx.TraceGroupModel.QueryGroup(one.ComponentName, one.Path.String, one.Platform, types.ProjectXbh, one.Version, 2)
	if err != nil {
		return nil, err
	}
	m := map[string]string{}
	for i := range groups {
		m[groups[i].AppVersion] = groups[i].ElementPath
		groupId = groups[i].GroupId
	}
	return &types.QueryTraceGroupResoponse{
		GroupId: groupId,
		Groups:  m,
	}, nil
}
