package model

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/tal-tech/go-zero/core/stores/sqlc"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
	"github.com/tal-tech/go-zero/core/stringx"
	"github.com/tal-tech/go-zero/tools/goctl/model/sql/builderx"
)

var (
	traceDailyRecordFieldNames          = builderx.FieldNames(&TraceDailyRecord{})
	traceDailyRecordRows                = strings.Join(traceDailyRecordFieldNames, ",")
	traceDailyRecordRowsExpectAutoSet   = strings.Join(stringx.Remove(traceDailyRecordFieldNames, "`id`", "`create_time`", "`update_time`"), ",")
	traceDailyRecordRowsWithPlaceHolder = strings.Join(stringx.Remove(traceDailyRecordFieldNames, "`id`", "`create_time`", "`update_time`"), "=?,") + "=?"
)

type (
	TraceDailyRecordModel interface {
		Insert(data TraceDailyRecord) (sql.Result, error)
		FindOne(id int64) (*TraceDailyRecord, error)
		Update(data TraceDailyRecord) error
		Delete(id int64) error
		QuerySevenDaysData(coponentName, path, os, version string) ([]*TraceDailyRecord, error)
		QueryHasData(coponentName, path, os, version string) (bool, error)
	}

	defaultTraceDailyRecordModel struct {
		conn  sqlx.SqlConn
		table string
	}

	TraceDailyRecord struct {
		Id                int64     `db:"id"`
		Cnt               int64     `db:"cnt"`
		ComponentName     string    `db:"component_name"`
		Path              string    `db:"path"`
		Os                string    `db:"os"`
		BlackboardVersion string    `db:"blackboard_version"`
		ExecTime          time.Time `db:"exec_time"`
		DataTime          time.Time `db:"data_time"`
	}
)

func NewTraceDailyRecordModel(conn sqlx.SqlConn) TraceDailyRecordModel {
	return &defaultTraceDailyRecordModel{
		conn:  conn,
		table: "`trace_daily_record`",
	}
}

func (m *defaultTraceDailyRecordModel) Insert(data TraceDailyRecord) (sql.Result, error) {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?, ?)", m.table, traceDailyRecordRowsExpectAutoSet)
	ret, err := m.conn.Exec(query, data.Cnt, data.ComponentName, data.Path, data.Os, data.BlackboardVersion, data.ExecTime, data.DataTime)
	return ret, err
}

func (m *defaultTraceDailyRecordModel) FindOne(id int64) (*TraceDailyRecord, error) {
	query := fmt.Sprintf("select %s from %s where `id` = ? limit 1", traceDailyRecordRows, m.table)
	var resp TraceDailyRecord
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

func (m *defaultTraceDailyRecordModel) Update(data TraceDailyRecord) error {
	query := fmt.Sprintf("update %s set %s where `id` = ?", m.table, traceDailyRecordRowsWithPlaceHolder)
	_, err := m.conn.Exec(query, data.Cnt, data.ComponentName, data.Path, data.Os, data.BlackboardVersion, data.ExecTime, data.DataTime, data.Id)
	return err
}

func (m *defaultTraceDailyRecordModel) Delete(id int64) error {
	query := fmt.Sprintf("delete from %s where `id` = ?", m.table)
	_, err := m.conn.Exec(query, id)
	return err
}

func (m *defaultTraceDailyRecordModel) QuerySevenDaysData(componentName, path, os, version string) ([]*TraceDailyRecord, error) {
	query := `select *
from trace_daily_record
where data_time >= unix_timestamp(current_date() - interval 7 day)
  and component_name = ?
  and path = ?
  and os = ?
  and blackboard_version = ?`
	records := []*TraceDailyRecord{}
	if err := m.conn.QueryRows(&records, query, componentName, path, os, version); err != nil {
		return nil, err
	}
	return records, nil
}
func (m *defaultTraceDailyRecordModel) QueryHasData(componentName, path, os, version string) (bool, error) {
	query := `select count(1) cnt
from trace_daily_record
where component_name = ?
  and path = ?
  and os = ?
  and blackboard_version = ?
limit 1`
	d := struct {
		Cnt int `db:"cnt"`
	}{}
	if err := m.conn.QueryRow(&d, query, componentName, path, os, version); err != nil {
		return false, err
	}
	return d.Cnt == 1, nil
}
