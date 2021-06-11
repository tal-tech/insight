package model

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/go-xorm/builder"
	"github.com/tal-tech/go-zero/core/stores/sqlc"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
	"github.com/tal-tech/go-zero/core/stringx"
	"github.com/tal-tech/go-zero/tools/goctl/model/sql/builderx"
)

var (
	traceGroupFieldNames          = builderx.FieldNames(&TraceGroup{})
	traceGroupRows                = strings.Join(traceGroupFieldNames, ",")
	traceGroupRowsExpectAutoSet   = strings.Join(stringx.Remove(traceGroupFieldNames, "id", "create_time", "update_time"), ",")
	traceGroupRowsWithPlaceHolder = strings.Join(stringx.Remove(traceGroupFieldNames, "id", "create_time", "update_time"), "=?,") + "=?"
)

type (
	TraceGroupModel interface {
		Insert(data TraceGroup) (sql.Result, error)
		FindOne(id int64) (*TraceGroup, error)
		FindOneByData(data *TraceGroup) (*TraceGroup, error)
		Update(data TraceGroup) error
		Delete(id int64) error
		QueryGroup(componentName, path, platform, project, version string, traceType int) ([]*TraceGroup, error)
	}

	defaultTraceGroupModel struct {
		conn  sqlx.SqlConn
		table string
	}

	TraceGroup struct {
		Id            int64     `db:"id"`
		GroupId       string    `db:"group_id"`    // 分组id，不用版本之间的同一元素的标识
		RecordType    string    `db:"record_type"` // element_new|element_change|element_unchange
		Platform      string    `db:"platform"`
		Project       string    `db:"project"` // 项目名
		AppVersion    string    `db:"app_version"`
		TraceType     int64     `db:"trace_type"`     // 埋点的类型
		ComponentName string    `db:"component_name"` // trace里的component_name
		PageId        string    `db:"page_id"`        // 经过特殊处理的component_name，可以看成页面的唯一表示
		ElementPath   string    `db:"element_path"`   // trace 表的path
		CreateTime    time.Time `db:"create_time"`
		UpdateTime    time.Time `db:"update_time"`
	}
)

func NewTraceGroupModel(conn sqlx.SqlConn) TraceGroupModel {
	return &defaultTraceGroupModel{
		conn:  conn,
		table: "`trace_group`",
	}
}

func (m *defaultTraceGroupModel) Insert(data TraceGroup) (sql.Result, error) {
	fmt.Println(traceGroupRowsExpectAutoSet)
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", m.table, traceGroupRowsExpectAutoSet)
	ret, err := m.conn.Exec(query, data.GroupId, data.RecordType, data.Platform, data.Project, data.AppVersion, data.TraceType, data.ComponentName, data.PageId, data.ElementPath)
	return ret, err
}

func (m *defaultTraceGroupModel) FindOne(id int64) (*TraceGroup, error) {
	query := fmt.Sprintf("select %s from %s where `id` = ? limit 1", traceGroupRows, m.table)
	var resp TraceGroup
	err := m.conn.QueryRow(&resp, query, id)
	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *defaultTraceGroupModel) Update(data TraceGroup) error {
	query := fmt.Sprintf("update %s set %s where `id` = ?", m.table, traceGroupRowsWithPlaceHolder)
	_, err := m.conn.Exec(query, data.GroupId, data.RecordType, data.Platform, data.Project, data.AppVersion, data.TraceType, data.ComponentName, data.PageId, data.ElementPath, data.Id)
	return err
}

func (m *defaultTraceGroupModel) Delete(id int64) error {
	query := fmt.Sprintf("delete from %s where `id` = ?", m.table)
	_, err := m.conn.Exec(query, id)
	return err
}
func (m *defaultTraceGroupModel) FindOneByData(data *TraceGroup) (*TraceGroup, error) {
	build := builder.Dialect(builder.MYSQL).Select(traceGroupRows).From(m.table).Where(nil)
	if data.Platform != "" {
		build.And(builder.Eq{`platform`: data.Platform})
	}
	if data.Project != "" {
		build.And(builder.Eq{`project`: data.Project})
	}
	if data.PageId != "" {
		build.And(builder.Eq{`page_id`: data.PageId})
	}
	if data.ElementPath != "" {
		build.And(builder.Eq{`element_path`: data.ElementPath})
	}
	if data.AppVersion != "" {
		build.And(builder.Eq{`app_version`: data.AppVersion})
	}

	query, args, err := build.OrderBy(`id desc`).Limit(1).ToSQL()
	if err != nil {
		return nil, err
	}
	result := &TraceGroup{}
	if err := m.conn.QueryRow(result, query, args...); err != nil {
		return nil, err
	}
	return result, nil
}

func (m *defaultTraceGroupModel) QueryGroup(componentName, path, platform, project, version string, traceType int) ([]*TraceGroup, error) {
	query := `select *
from trace_group
where group_id = (select group_id
                   from trace_group
                   where component_name = ?
                     and element_path = ?
                     and platform = ?
                     and project = ?
                     and app_version = ?
                     and trace_type = ?)`
	groups := []*TraceGroup{}
	if err := m.conn.QueryRows(&groups, query, componentName, path, platform, project, version, traceType); err != nil {
		return nil, err
	}
	return groups, nil
}
