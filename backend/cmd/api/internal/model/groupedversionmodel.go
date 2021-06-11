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
	groupedVersionFieldNames          = builderx.FieldNames(&GroupedVersion{})
	groupedVersionRows                = strings.Join(groupedVersionFieldNames, ",")
	groupedVersionRowsExpectAutoSet   = strings.Join(stringx.Remove(groupedVersionFieldNames, "`id`", "`create_time`", "`update_time`"), ",")
	groupedVersionRowsWithPlaceHolder = strings.Join(stringx.Remove(groupedVersionFieldNames, "`id`", "`create_time`", "`update_time`"), "=?,") + "=?"
)

type (
	GroupedVersionModel interface {
		Insert(data GroupedVersion) (sql.Result, error)
		FindOne(id int64) (*GroupedVersion, error)
		Update(data GroupedVersion) error
		Delete(id int64) error
		FindVersions(appId, platform string) ([]*GroupedVersion, error)
	}

	defaultGroupedVersionModel struct {
		conn  sqlx.SqlConn
		table string
	}

	GroupedVersion struct {
		Id         int64     `db:"id"`
		CreateTime time.Time `db:"create_time"`
		Version    string    `db:"version"`
		AppId      string    `db:"app_id"`
		Platform   string    `db:"platform"`
	}
)

func NewGroupedVersionModel(conn sqlx.SqlConn) GroupedVersionModel {
	return &defaultGroupedVersionModel{
		conn:  conn,
		table: "`grouped_version`",
	}
}

func (m *defaultGroupedVersionModel) Insert(data GroupedVersion) (sql.Result, error) {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?)", m.table, groupedVersionRowsExpectAutoSet)
	ret, err := m.conn.Exec(query, data.Version, data.AppId, data.Platform)
	return ret, err
}

func (m *defaultGroupedVersionModel) FindOne(id int64) (*GroupedVersion, error) {
	query := fmt.Sprintf("select %s from %s where `id` = ? limit 1", groupedVersionRows, m.table)
	var resp GroupedVersion
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

func (m *defaultGroupedVersionModel) Update(data GroupedVersion) error {
	query := fmt.Sprintf("update %s set %s where `id` = ?", m.table, groupedVersionRowsWithPlaceHolder)
	_, err := m.conn.Exec(query, data.Version, data.AppId, data.Platform, data.Id)
	return err
}

func (m *defaultGroupedVersionModel) Delete(id int64) error {
	query := fmt.Sprintf("delete from %s where `id` = ?", m.table)
	_, err := m.conn.Exec(query, id)
	return err
}

func (m *defaultGroupedVersionModel) FindVersions(appId, platform string) ([]*GroupedVersion, error) {
	query := `select * from grouped_version where app_id = ? and platform = ? order by create_time desc`
	res := []*GroupedVersion{}
	if err := m.conn.QueryRows(res, query, appId, platform); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return res, nil
}
