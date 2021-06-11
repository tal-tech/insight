package logic

import (
	"context"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/cds/pkg/ckgroup"
	"github.com/tal-tech/go-zero/core/logx"
)

type QuerySevenDatasLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewQuerySevenDatasLogic(ctx context.Context, svcCtx *svc.ServiceContext) QuerySevenDatasLogic {
	return QuerySevenDatasLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *QuerySevenDatasLogic) QuerySevenDatas(req types.QuerySevenDataRequest) (*types.QuerySevenDataResponse, error) {
	one, err := l.svcCtx.ElementInfoModel.FindOne(int64(req.Id))
	if err != nil {
		return nil, err
	}
	m, err := queryData(l.svcCtx.CkConn, one)
	if err != nil {
		return nil, err
	}
	return &types.QuerySevenDataResponse{Data: m}, nil
}

func queryData(conn ckgroup.CKConn, one *model.TraceVisualElementInfo) (map[int64]int64, error) {
	query := `select toInt64(toUnixTimestamp(time_slot)) t, cnt
from trace_daily_cnt_all
where time_slot >= today() - 8
  and time_slot <= today() -1
  and type = ?
  and os = ?
  and component_name = ?
  and path = ?
  and blackboard_version = ?;`
	traceType := 0
	if one.IsPage == 1 {
		traceType = 1
	} else {
		traceType = 2
	}
	maps, err := conn.QueryRowsNoType(query, traceType, one.Platform, one.ComponentName, one.Path.String, one.Version)
	if err != nil {
		return nil, err
	}
	result := map[int64]int64{}
	for i := range maps {
		item := maps[i]
		result[item["t"].(int64)] = item["cnt"].(int64)
	}
	return result, nil
}
