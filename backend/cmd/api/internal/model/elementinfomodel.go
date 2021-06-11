package model

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"tracking/cmd/api/internal/types"

	"github.com/go-xorm/builder"
	"github.com/tal-tech/cds/pkg/ckgroup"
	"github.com/tal-tech/go-zero/core/stores/sqlc"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
	"github.com/tal-tech/go-zero/core/stringx"
	"github.com/tal-tech/go-zero/tools/goctl/model/sql/builderx"
	"github.com/thoas/go-funk"
)

var (
	traceVisualElementInfoFieldNames          = builderx.FieldNames(&TraceVisualElementInfo{})
	traceVisualElementInfoRows                = strings.Join(traceVisualElementInfoFieldNames, ",")
	traceVisualElementInfoRowsExpectAutoSet   = strings.Join(stringx.Remove(traceVisualElementInfoFieldNames, "id", "create_time", "update_time"), ",")
	traceVisualElementInfoRowsWithPlaceHolder = strings.Join(stringx.Remove(traceVisualElementInfoFieldNames, "id", "create_time", "update_time"), "=?,") + "=?"
)

type (
	ElementInfoModel interface {
		Insert(data TraceVisualElementInfo) (sql.Result, error)
		FindOne(id int64) (*TraceVisualElementInfo, error)
		FindOneByPageGroupId(pageGroupId string) (*TraceVisualElementInfo, error)
		QueryTwoPagesByPageGroupId(pageGroupId string) ([]*TraceVisualElementInfo, error)
		Update(data TraceVisualElementInfo) error
		UpdatePageModuleIdByPageGroupId(newModuleId, preModuleId int64, pageGroupId string) error
		UpdatePageNameByPageGroupId(pageName, pageGroupId string) error
		UpdatePageGroupIdByPageId(pageGroupId, pageId, platform string) error
		// CheckPageNameHasSame todo 应该不需要 ids 了
		CheckPageNameHasSame(pageName string, ids []int64) (bool, error)
		Delete(id int64) error
		DeleteByElementInfo(data TraceVisualElementInfo) error
		Has(data TraceVisualElementInfo) (bool, *TraceVisualElementInfo, error)
		AppQueryList(appId, platform, version string) ([]*TraceVisualElementInfo, error)
		QueryByPageId(pageId, platform string) ([]*PageItemDetailItem, error)
		FindPreviousPageVersion(pageId, platfrom, version string) (*TraceVisualElementInfo, error)
		QueryPageListByComponetName(componentName []string, platform string, currentPage, pageSize int, version string) ([]*PageInfo, error)
		QueryMultiVersionPage(pageId, platform, appId string) ([]*TraceVisualElementInfo, error)
		QueryPageListByPageGroupId(pageGroupId, platform string) ([]*TraceVisualElementInfo, error)
	}

	defaultElementInfoModel struct {
		conn   sqlx.SqlConn
		ckConn ckgroup.CKConn
		table  string
	}

	TraceVisualElementInfo struct {
		Id                 int64          `db:"id"`
		TraceName          sql.NullString `db:"trace_name"`     // 用户定义的埋点名称
		IsPage             int64          `db:"is_page"`        // 是否是页面
		PageModuleId       sql.NullInt64  `db:"page_module_id"` // 页面的模块 id
		PageName           sql.NullString `db:"page_name"`      // 页面名称
		PageId             string         `db:"page_id"`        // 页面的标识，android 是取 componentName 中的 activeiy，ios 是 componentName 的值
		ComponentName      string         `db:"component_name"`
		Path               sql.NullString `db:"path"`
		Picture            string         `db:"picture"`  // 截图的 url
		Position           sql.NullString `db:"position"` // 元素的坐标
		Version            string         `db:"version"`  // 版本号
		AppId              string         `db:"app_id"`
		Platform           string         `db:"platform"` // android,iOS,flutter
		CreateTime         time.Time      `db:"create_time"`
		UpdateTime         sql.NullTime   `db:"update_time"`
		IsDynamicElement   sql.NullInt64  `db:"is_dynamic_element"` // 是否是动态的元素,根据林志航的算法
		TraceType          sql.NullString `db:"trace_type"`         // 埋点类型，待定
		Creator            string         `db:"creator"`            // 上传者的名称或 user_id
		Updater            sql.NullString `db:"updater"`
		AndroidIosRelation sql.NullString `db:"android_ios_relation"` // android ios 关于同一个页面的对应关系
		PageGroupId        string         `db:"page_group_id"`        // android和ios 同一个页面的id，是页面时才有值
		FullPicture        string         `db:"full_picture"`         // 元素所属页面的截图  ，如果是页面，该字段为空
		PageTitle          string         `db:"page_title"`           // 页面的标题
	}
	PageInfo struct {
		Platform    string         `db:"platform"`  // android,iOS,flutter
		Picture     string         `db:"picture"`   // 截图的 url
		PageName    sql.NullString `db:"page_name"` // 页面名称
		PageId      string         `db:"page_id"`
		ModuleName  sql.NullString `db:"module_name"`
		Id          int            `db:"id"`
		PageGroupId string         `db:"page_group_id"`
	}
	PageItemDetailItem struct {
		TraceName     sql.NullString `db:"trace_name"` // 用户定义的埋点名称
		TraceType     sql.NullString `db:"trace_type"` // 埋点类型，待定
		ComponentName string         `db:"component_name"`
		Path          sql.NullString `db:"path"`
		Id            int64          `db:"id"`
		Picture       string         `db:"picture"` // 截图的 url
		FullPicture   string         `db:"full_picture"`
		Position      sql.NullString `db:"position"` // 元素的坐标
		Version       string         `db:"version"`
		Platform      string         `db:"platform"`
	}
)

func NewElementInfoModel(conn sqlx.SqlConn, ckConn ckgroup.CKConn) ElementInfoModel {
	return &defaultElementInfoModel{
		conn:   conn,
		ckConn: ckConn,
		table:  "element_info",
	}
}

func (m *defaultElementInfoModel) Insert(data TraceVisualElementInfo) (sql.Result, error) {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)", m.table, traceVisualElementInfoRowsExpectAutoSet)
	ret, err := m.conn.Exec(
		query,
		data.TraceName,
		data.IsPage,
		data.PageModuleId,
		data.PageName,
		data.PageId,
		data.ComponentName,
		data.Path,
		data.Picture,
		data.Position,
		data.Version,
		data.AppId,
		data.Platform,
		data.IsDynamicElement,
		data.TraceType,
		data.Creator,
		data.Updater,
		data.AndroidIosRelation,
		data.PageGroupId,
		data.FullPicture,
		data.PageTitle,
	)
	return ret, err
}

func (m *defaultElementInfoModel) FindOne(id int64) (*TraceVisualElementInfo, error) {
	query := fmt.Sprintf("select %s from %s where id = ? limit 1", traceVisualElementInfoRows, m.table)
	var resp TraceVisualElementInfo
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

func (m *defaultElementInfoModel) FindOneByPageGroupId(pageGroupId string) (*TraceVisualElementInfo, error) {
	query := fmt.Sprintf("select %s from %s where page_group_id = ? limit 1", traceVisualElementInfoRows, m.table)
	var resp TraceVisualElementInfo
	err := m.conn.QueryRow(&resp, query, pageGroupId)
	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *defaultElementInfoModel) UpdatePageModuleIdByPageGroupId(newModuleId, preModuleId int64, pageGroupId string) error {
	updatePageModlueSQL, args, err := builder.Dialect(builder.MYSQL).Update(builder.Eq{"page_module_id": newModuleId}).From(m.table).And(builder.Eq{`page_group_id`: pageGroupId}).ToSQL()
	if err != nil {
		return err
	}
	return m.conn.Transact(func(session sqlx.Session) error {
		// 更新页面的模块 id
		if _, err := session.Exec(updatePageModlueSQL, args...); err != nil {
			return err
		}

		moduleModel := NewModuleModel(m.conn)
		updatePageOrderSQL := `update module set page_order = ? where id = ?`

		// 更新之前的模块排序
		if preModuleId > 0 {
			preModule, err := moduleModel.FindOne(int(preModuleId))
			if err != nil {
				return err
			}
			newPrePageOrderStr := strings.ReplaceAll(preModule.PageOrder.String, pageGroupId+`,`, ``)
			if _, err := session.Exec(updatePageOrderSQL, newPrePageOrderStr, preModuleId); err != nil {
				return err
			}
		}
		// 更新最新的模块排序
		newModule, err := moduleModel.FindOne(int(newModuleId))
		if err != nil && err != sqlx.ErrNotFound {
			return err
		}
		newPageOrderStr := ""
		if newModule != nil {
			newPageOrderStr = newModule.PageOrder.String
		}
		newPageOrderStr += pageGroupId + `,`
		if _, err := session.Exec(updatePageOrderSQL, newPageOrderStr, newModuleId); err != nil {
			return err
		}
		return nil
	})
}

func (m *defaultElementInfoModel) UpdatePageNameByPageGroupId(pageName, pageGroupId string) error {
	query, args, err := builder.Dialect(builder.MYSQL).Update(builder.Eq{"page_name": pageName}).From(m.table).And(builder.Eq{`page_group_id`: pageGroupId}).ToSQL()
	if err != nil {
		return err
	}
	if _, err := m.conn.Exec(query, args...); err != nil {
		return err
	}
	return nil
}

func (m *defaultElementInfoModel) UpdatePageGroupIdByPageId(pageGroupId, pageId, platform string) error {
	query, args, err := builder.Dialect(builder.MYSQL).Update(builder.Eq{"page_group_id": pageGroupId}).
		From(m.table).And(builder.Eq{`page_id`: pageId, `platform`: platform}).ToSQL()
	if err != nil {
		return err
	}
	if _, err := m.conn.Exec(query, args...); err != nil {
		return err
	}
	return nil
}

func (m *defaultElementInfoModel) Update(data TraceVisualElementInfo) error {
	query := fmt.Sprintf("update %s set %s where id = ?", m.table, traceVisualElementInfoRowsWithPlaceHolder)
	_, err := m.conn.Exec(
		query,
		data.TraceName,
		data.IsPage,
		data.PageModuleId,
		data.PageName,
		data.PageId,
		data.ComponentName,
		data.Path,
		data.Picture,
		data.Position,
		data.Version,
		data.AppId,
		data.Platform,
		data.IsDynamicElement,
		data.TraceType,
		data.Creator,
		data.Updater,
		data.AndroidIosRelation,
		data.PageGroupId,
		data.FullPicture,
		data.PageTitle,
		data.Id,
	)
	return err
}

func (m *defaultElementInfoModel) Delete(id int64) error {
	query := fmt.Sprintf("delete from %s where id = ?", m.table)
	_, err := m.conn.Exec(query, id)
	return err
}
func (m *defaultElementInfoModel) DeleteByElementInfo(data TraceVisualElementInfo) error {
	deleteBuilder := builder.Dialect(builder.MYSQL).Delete().From(m.table)
	deleteBuilder = deleteBuilder.Where(builder.Eq{"is_page": data.IsPage}).
		And(builder.Eq{"app_id": data.AppId}).
		And(builder.Eq{"platform": data.Platform})

	if data.Version != `` {
		deleteBuilder = deleteBuilder.And(builder.Eq{"version": data.Version})
	}
	if data.PageId != `` {
		deleteBuilder = deleteBuilder.And(builder.Eq{"page_id": data.PageId})
	}

	if data.IsPage == 1 {
		deleteBuilder = deleteBuilder.And(builder.IsNull{"path"})
	} else {
		deleteBuilder = deleteBuilder.And(builder.Eq{"path": data.Path.String})
		deleteBuilder = deleteBuilder.And(builder.Eq{"component_name": data.ComponentName})
	}
	deleteSQL, args, err := deleteBuilder.ToSQL()
	if err != nil {
		return nil
	}
	_, err = m.conn.Exec(deleteSQL, args...)
	return err
}

func (m *defaultElementInfoModel) Has(data TraceVisualElementInfo) (bool, *TraceVisualElementInfo, error) {
	var resp TraceVisualElementInfo
	query := ""
	args := []interface{}{}
	args = append(args, data.IsPage, data.AppId, data.Platform, data.Version, data.PageId)

	if data.IsPage == 1 {
		query = fmt.Sprintf(`select *  from %s where  is_page = ? and app_id = ? and platform = ?  and version = ?  and page_id = ? and creator != 'extend' limit 1`, m.table)
	} else {
		query = fmt.Sprintf(`select *  from %s where is_page = ? and app_id = ?  and platform = ? and version = ?   and page_id = ?  and component_name = ?  and path = ? and creator != 'extend' limit 1`, m.table)
		args = append(args, data.ComponentName, data.Path)
	}

	if err := m.conn.QueryRow(&resp, query, args...); err != nil {
		if err == sql.ErrNoRows {
			return false, nil, nil
		}
		return false, nil, err
	}
	return true, &resp, nil
}

func (m *defaultElementInfoModel) AppQueryList(appId, platform, version string) ([]*TraceVisualElementInfo, error) {
	results := []*TraceVisualElementInfo{}
	query := fmt.Sprintf("select %s from %s where app_id = ? and platform=? and version = ? and creator !='extend'", traceVisualElementInfoRows, m.table)

	if err := m.conn.QueryRows(&results, query, appId, platform, version); err != nil {
		return nil, err
	}
	return results, nil
}

func (m *defaultElementInfoModel) QueryPageListByComponetName(componentName []string, platform string, currentPage, pageSize int, version string) ([]*PageInfo, error) {
	build := builder.Dialect(builder.MYSQL).Select(`*`).From(m.table).Where(builder.Eq{"is_page": 1, `platform`: platform, `version`: version})
	if platform == types.AndroidPlatform {
		subSQL := ""
		args := []interface{}{}
		for i := range componentName {
			if i == len(componentName)-1 {
				subSQL += "(? like concat(page_id,'%'))"
			} else {
				subSQL += "(? like concat(page_id,'%')) or "
			}
			args = append(args, componentName[i])
		}
		build = build.And(builder.Expr(subSQL, args...))
	} else {
		build = build.And(builder.In(`page_id`, componentName))
	}
	build = build.OrderBy(`create_time desc`).Limit(pageSize, (currentPage-1)*pageSize)
	query, args, err := build.ToSQL()
	if err != nil {
		return nil, err
	}
	infos := []*PageInfo{}
	if err := m.conn.QueryRows(&infos, query, args...); err != nil {
		return nil, err
	}
	return infos, nil
}

func (m *defaultElementInfoModel) QueryByPageId(pageId, platform string) ([]*PageItemDetailItem, error) {
	query := `select trace_name,
       trace_type,
       component_name,
       path,
       position,
       id,
       version,
       platform,
       picture,
		full_picture
from element_info
where is_page = 0
  and page_id = ?
  and platform = ?
order by create_time desc`
	var items []*PageItemDetailItem
	if err := m.conn.QueryRowsPartial(&items, query, pageId, platform); err != nil {
		return nil, err
	}
	return items, nil
}

func (m *defaultElementInfoModel) QueryPageListByPageGroupId(pageGroupId, platform string) ([]*TraceVisualElementInfo, error) {
	query := `select * from element_info where page_group_id = ? and platform = ?  order by  id desc`
	var pages []*TraceVisualElementInfo
	if err := m.conn.QueryRows(&pages, query, pageGroupId, platform); err != nil {
		return nil, err
	}
	return pages, nil
}

func (m *defaultElementInfoModel) CheckPageNameHasSame(pageName string, ids []int64) (bool, error) {
	var temp []interface{}
	funk.ConvertSlice(ids, &temp)
	query, args, err := builder.Dialect(builder.MYSQL).Select(`count(1) cnt`).From(m.table).
		Where(builder.Eq{"page_name": pageName}).And(builder.NotIn("id", temp...)).ToSQL()
	if err != nil {
		return false, nil
	}
	d := struct {
		Cnt int `db:"cnt"`
	}{}
	if err := m.conn.QueryRow(&d, query, args...); err != nil {
		return false, err
	}
	return d.Cnt > 0, nil
}

func (m *defaultElementInfoModel) FindPreviousPageVersion(pageId, platfrom, version string) (*TraceVisualElementInfo, error) {
	res := TraceVisualElementInfo{}
	err := m.conn.QueryRow(&res, `select *
from element_info
where page_id = ?
  and platform = ?
  and is_page = 1
  and version != ?
order by id desc
limit 1`, pageId, platfrom, version)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		} else {
			return nil, err
		}
	}
	return &res, nil
}

func (m *defaultElementInfoModel) QueryMultiVersionPage(pageId, platform, appId string) ([]*TraceVisualElementInfo, error) {
	query := `select * from element_info where page_id = ? and platform = ? and app_id = ? and is_page = 1`
	res := []*TraceVisualElementInfo{}
	if err := m.conn.QueryRows(&res, query, pageId, platform, appId); err != nil {
		return nil, err
	}
	return res, nil
}

func (m *defaultElementInfoModel) QueryTwoPagesByPageGroupId(pageGroupId string) ([]*TraceVisualElementInfo, error) {
	query := `(select * from element_info where page_group_id = ? and platform = 'android' limit 1)
union
(select * from element_info where page_group_id = ? and platform = 'iOS' limit 1)`
	pages := []*TraceVisualElementInfo{}
	if err := m.conn.QueryRows(&pages, query, pageGroupId, pageGroupId); err != nil {
		return nil, err
	}
	return pages, nil
}
