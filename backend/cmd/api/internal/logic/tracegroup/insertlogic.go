package logic

import (
	"context"
	"database/sql"
	"fmt"

	"tracking/cmd/api/internal/logic"
	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	uuid "github.com/satori/go.uuid"

	"github.com/tal-tech/go-zero/core/logx"
)

type InsertLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewInsertLogic(ctx context.Context, svcCtx *svc.ServiceContext) InsertLogic {
	return InsertLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *InsertLogic) Insert(req types.TraceGroupInsertRequest) error {
	datas := []*model.TraceGroup{}
	failItems := []types.ElementItem{}
	failGroups := []types.ElementGroup{}

	for _, item := range req.ElementNew {
		datas = append(datas, buildTraceGroupModel(item, types.ElementNew))
	}
	for _, item := range req.ElementUnchanged {
		groupModel := buildTraceGroupModel(item, types.ElementUnChanged)
		temp, err := l.svcCtx.TraceGroupModel.FindOneByData(&model.TraceGroup{
			Platform:    groupModel.Platform,
			Project:     groupModel.Project,
			PageId:      groupModel.PageId,
			ElementPath: groupModel.ElementPath,
		})
		if err != nil {
			if err == sql.ErrNoRows {
				failItems = append(failItems, item)
			}
			return err
		}
		groupModel.GroupId = temp.GroupId
		datas = append(datas, groupModel)
	}
	for _, item := range req.ElementChange {
		pageId, _ := logic.ParsePageId(item.ComponentName, item.Platform, "")
		temp, err := l.svcCtx.TraceGroupModel.FindOneByData(&model.TraceGroup{
			Platform:    item.Platform,
			Project:     types.ProjectXbh,
			AppVersion:  item.OldAppVersion,
			PageId:      pageId,
			ElementPath: item.OldElementPath,
		})
		if err != nil {
			if err == sql.ErrNoRows {
				failGroups = append(failGroups, item)
				continue
			}
			return err
		}
		groupModel := &model.TraceGroup{
			GroupId:       temp.GroupId,
			RecordType:    types.ElementChanged,
			Platform:      item.Platform,
			Project:       types.ProjectXbh,
			AppVersion:    item.CurrentAppVersion,
			TraceType:     item.TraceType,
			ComponentName: item.ComponentName,
			PageId:        pageId,
			ElementPath:   item.CurrentElementPath,
		}
		groupModel.GroupId = temp.GroupId
		datas = append(datas, groupModel)
	}

	if len(failItems) != 0 {
		msg := fmt.Sprintf("trace-visual 中 trace group 插入失败了一部分：%s", fmt.Sprintf("%+v", failItems))
		logx.Error(msg)
		// talalert.Alert(false, talalert.AtRobot, msg, talalert.ZSY)
	}
	if len(failGroups) != 0 {
		msg := fmt.Sprintf("trace-visual 中 trace group 插入失败了一部分：%s", fmt.Sprintf("%+v", failGroups))
		logx.Error(msg)
		// talalert.Alert(false, talalert.AtRobot, msg, talalert.ZSY)
	}
	for i := range datas {
		_, err := l.svcCtx.TraceGroupModel.Insert(*datas[i])
		if err != nil {
			return err
		}
	}
	return nil
}

func buildTraceGroupModel(item types.ElementItem, RecordType types.TraceGroupType) *model.TraceGroup {
	pageId, _ := logic.ParsePageId(item.ComponentName, item.Platform, "")
	return &model.TraceGroup{
		GroupId:       uuid.NewV4().String(),
		RecordType:    RecordType,
		Platform:      item.Platform,
		Project:       types.ProjectXbh,
		AppVersion:    item.CurrentAppVersion,
		TraceType:     item.TraceType,
		ComponentName: item.ComponentName,
		PageId:        pageId,
		ElementPath:   item.ElementPath,
	}
}
