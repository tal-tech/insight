package model

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/stores/sqlc"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
	"github.com/tal-tech/go-zero/core/stringx"
	"github.com/tal-tech/go-zero/tools/goctl/model/sql/builderx"
)

var (
	moduleFieldNames          = builderx.FieldNames(&Module{})
	moduleRows                = strings.Join(moduleFieldNames, ",")
	moduleRowsExpectAutoSet   = strings.Join(stringx.Remove(moduleFieldNames, "id", "create_time", "update_time"), ",")
	moduleRowsWithPlaceHolder = strings.Join(stringx.Remove(moduleFieldNames, "id", "create_time", "update_time"), "=?,") + "=?"
)

type (
	ModuleModel struct {
		conn  sqlx.SqlConn
		table string
	}

	Module struct {
		Id         int64          `db:"id"`
		ModuleName string         `db:"module_name"`
		CreateBy   int64          `db:"create_by"`
		UpdateBy   int64          `db:"update_by"`
		CreateTime time.Time      `db:"create_time"`
		UpdateTime time.Time      `db:"update_time"`
		Model      int64          `db:"model"`
		PageOrder  sql.NullString `db:"page_order"`
	}
)

func NewModuleModel(conn sqlx.SqlConn) *ModuleModel {
	return &ModuleModel{
		conn:  conn,
		table: "module",
	}
}

func (m *ModuleModel) Insert(data Module) (sql.Result, error) {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?,?)", m.table, moduleRowsExpectAutoSet)
	ret, err := m.conn.Exec(query, data.ModuleName, data.CreateBy, data.UpdateBy, data.Model, data.PageOrder)
	return ret, err
}

func (m *ModuleModel) FindOne(id int) (*Module, error) {
	query := fmt.Sprintf("select %s from %s where id = ? limit 1", moduleRows, m.table)
	var resp Module
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

func (m *ModuleModel) Update(data Module) error {
	query := fmt.Sprintf("update %s set %s where id = ?", m.table, moduleRowsWithPlaceHolder)
	_, err := m.conn.Exec(query, data.ModuleName, data.CreateBy, data.UpdateBy, data.Model, data.PageOrder, data.Id)
	return err
}

func (m *ModuleModel) Delete(id int64) error {
	query := fmt.Sprintf("delete from %s where id = ?", m.table)
	_, err := m.conn.Exec(query, id)
	return err
}

func (m *ModuleModel) QueryModuleList(req types.QueryModuleListRequest) ([]*Module, error) {
	var result []*Module
	query := fmt.Sprintf("select %s from %s where 1 ", moduleRows, m.table)
	if req.ModuleName != "" {
		query = query + " and module_name like '%" + req.ModuleName + "%'"
	}
	query = query + " order by model ,module_name"

	if err := m.conn.QueryRows(&result, query); err != nil {
		return nil, err
	}
	return result, nil
}
