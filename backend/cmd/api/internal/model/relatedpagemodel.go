package model

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"tracking/cmd/api/internal/types"

	"github.com/go-xorm/builder"
	"github.com/tal-tech/go-zero/core/stores/sqlc"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
	"github.com/tal-tech/go-zero/core/stringx"
	"github.com/tal-tech/go-zero/tools/goctl/model/sql/builderx"
)

var (
	relatedPageFieldNames          = builderx.FieldNames(&RelatedPage{})
	relatedPageRows                = strings.Join(relatedPageFieldNames, ",")
	relatedPageRowsExpectAutoSet   = strings.Join(stringx.Remove(relatedPageFieldNames, "id", "create_time", "update_time"), ",")
	relatedPageRowsWithPlaceHolder = strings.Join(stringx.Remove(relatedPageFieldNames, "id", "create_time", "update_time"), "=?,") + "=?"
)

type (
	RelatedPageModel struct {
		conn  sqlx.SqlConn
		table string
	}

	RelatedPage struct {
		Id            int64     `db:"id"`
		ComponentName string    `db:"component_name"`
		Version       string    `db:"version"`
		Os            string    `db:"os"`
		RelatedPages  string    `db:"related_pages"`
		ExecTime      time.Time `db:"exec_time"`
		DataTime      time.Time `db:"data_time"`
	}
)

func NewRelatedPageModel(conn sqlx.SqlConn) *RelatedPageModel {
	return &RelatedPageModel{
		conn:  conn,
		table: "related_page",
	}
}

func (m *RelatedPageModel) Insert(data RelatedPage) (sql.Result, error) {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?)", m.table, relatedPageRowsExpectAutoSet)
	ret, err := m.conn.Exec(query, data.ComponentName, data.Version, data.Os, data.RelatedPages, data.ExecTime, data.DataTime)
	return ret, err
}

func (m *RelatedPageModel) FindOne(id int64) (*RelatedPage, error) {
	query := fmt.Sprintf("select %s from %s where id = ? limit 1", relatedPageRows, m.table)
	var resp RelatedPage
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

func (m *RelatedPageModel) Update(data RelatedPage) error {
	query := fmt.Sprintf("update %s set %s where id = ?", m.table, relatedPageRowsWithPlaceHolder)
	_, err := m.conn.Exec(query, data.ComponentName, data.Version, data.Os, data.RelatedPages, data.ExecTime, data.DataTime, data.Id)
	return err
}

func (m *RelatedPageModel) Delete(id int64) error {
	query := fmt.Sprintf("delete from %s where id = ?", m.table)
	_, err := m.conn.Exec(query, id)
	return err
}

func (m *RelatedPageModel) QueryRelatedPage(platfrom, version, pageId string) (string, error) {
	d := struct {
		RelatedPages string `json:"related_pages"`
	}{}
	build := builder.Dialect(builder.MYSQL).Select(`related_pages`).From(m.table).Where(builder.Eq{`os`: platfrom, `version`: version})
	if platfrom == types.AndroidPlatform {
		build = build.And(builder.Like{`component_name`, pageId + "%"})
	} else {
		build = build.And(builder.Eq{`component_name`: pageId})
	}
	build = build.OrderBy(`data_time desc`).Limit(1)
	query, args, err := build.ToSQL()
	if err != nil {
		return "", err
	}
	if err := m.conn.QueryRow(&d, query, args...); err != nil {
		return "", err
	}
	return d.RelatedPages, nil
}
