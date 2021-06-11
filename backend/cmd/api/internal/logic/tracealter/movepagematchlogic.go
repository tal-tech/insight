package logic

import (
	"context"
	"errors"
	"time"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"
	"tracking/cmd/api/internal/util"

	"github.com/tal-tech/go-zero/core/logx"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
)

type MovePageMatchLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewMovePageMatchLogic(ctx context.Context, svcCtx *svc.ServiceContext) MovePageMatchLogic {
	return MovePageMatchLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *MovePageMatchLogic) MovePageMatch(req types.MovePageMatchRequest) (*types.MovePageMatchResponse, error) {
	pages, err := l.svcCtx.ElementInfoModel.QueryPageListByPageGroupId(req.PageGroupId, req.Platform)
	if err != nil {
		return nil, err
	}
	if len(pages) == 0 {
		return nil, errors.New("没找到相应的页面")
	}
	if !pages[0].AndroidIosRelation.Valid {
		return nil, errors.New("当前页面已经是未匹配的状态")
	}
	moduleId := pages[0].PageModuleId
	var pageOrder string

	if moduleId.Int64 != 0 {
		moduleInfo, err := l.svcCtx.ModuleModel.FindOne(int(moduleId.Int64))
		if err != nil {
			return nil, err
		}
		pageOrder = moduleInfo.PageOrder.String
	}
	uuid := util.ShortUUID()

	err = l.svcCtx.MysqlConn.Transact(func(session sqlx.Session) error {
		if _, err := session.Exec(`update element_info set android_ios_relation = null  where page_group_id = ? and is_page = 1`, req.PageGroupId); err != nil {
			return err
		}
		if _, err := session.Exec(`update element_info set page_group_id = ?  where page_group_id = ? and platform =? and is_page = 1`, uuid, req.PageGroupId, req.Platform); err != nil {
			return err
		}
		if moduleId.Int64 == 0 {
			return nil
		}
		pageOrder = pageOrder + uuid + `,`
		if _, err := session.Exec(`update module set page_order = ? where id = ?`, pageOrder, moduleId.Int64); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	response := &types.MovePageMatchResponse{NewPageGroupId: uuid}

	go func() {
		time.Sleep(time.Minute)
		l.svcCtx.PageMatchChan <- pages[0].Id
		pagesOtherPlatorm, err := l.svcCtx.ElementInfoModel.QueryPageListByPageGroupId(req.PageGroupId, inversePlatform(req.Platform))
		if err != nil {
			logx.Error(`QueryPageListByPageGroupId error:`, err)
			return
		}
		if len(pagesOtherPlatorm) == 0 {
			return
		}
		l.svcCtx.PageMatchChan <- pagesOtherPlatorm[0].Id
	}()
	return response, nil
}

func inversePlatform(platfrom string) string {
	switch platfrom {
	case types.AndroidPlatform:
		return types.IOSPlatform
	case types.IOSPlatform:
		return types.AndroidPlatform
	default:
		return ``
	}
}
