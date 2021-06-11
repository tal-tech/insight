package logic

import (
	"context"
	"database/sql"
	"fmt"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"
	"tracking/cmd/api/internal/util"

	"github.com/go-xorm/builder"
	"github.com/tal-tech/cds/pkg/ckgroup"
	"github.com/tal-tech/go-zero/core/logx"
)

type WebQueryPageLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewWebQueryPageLogic(ctx context.Context, svcCtx *svc.ServiceContext) WebQueryPageLogic {
	return WebQueryPageLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *WebQueryPageLogic) WebQueryPage(req types.WebQueryPageRequest) (*types.WebQueryPageResponse, error) {
	ids, err := queryElementByStr(req.SearchStr, l.svcCtx.CkConn)
	if err != nil {
		return nil, err
	}
	ids2, err := queryPageByStr(req.SearchStr, l.svcCtx.CkConn)
	if err != nil {
		return nil, err
	}
	ids = append(ids, ids2...)

	ids3, err := filterIds(ids, l.svcCtx.CkConn)
	if err != nil {
		return nil, err
	}

	list, err := queryPages(req, ids3, l.svcCtx.CkConn)
	if err != nil {
		return nil, err
	}

	result := []*types.WebQueryPageItem{}
	for _, temp := range list {
		item := temp
		result = append(result, &types.WebQueryPageItem{
			Platform:       item.Platform,
			PageUrl:        item.Picture,
			PageName:       item.PageName.String,
			PageModuleName: item.ModuleName.String,
			PageId:         item.PageId,
			PageGroupId:    item.PageGroupId,
		})
	}
	return &types.WebQueryPageResponse{Pages: result}, nil
}

func queryElementByStr(str string, conn ckgroup.CKConn) ([]int64, error) {
	ids := []int64{}
	if str == "" {
		return ids, nil
	}
	likeStr := "%" + str + "%"
	result, err := conn.QueryRowsNoType(`select toInt64(id) id
from trace_visual.element_info
where is_page = 1
  and (page_id, platform) in (select distinct (page_id, platform)
                              from trace_visual.element_info
                              where (trace_name like ? or path like ?)
                                and is_page = 0)`, likeStr, likeStr)
	if err != nil {
		if err == sql.ErrNoRows {
			return ids, nil
		}
		return nil, err
	}
	for i := range result {
		ids = append(ids, result[i]["id"].(int64))
	}
	return ids, nil
}

func queryPageByStr(str string, conn ckgroup.CKConn) ([]int64, error) {
	ids := []int64{}
	build := builder.Dialect(builder.MYSQL).Select("toInt64(id) id").From(`trace_visual.element_info`).Where(builder.Eq{"is_page": 1})
	if str != "" {
		args := "%" + str + "%"
		build = build.Where(builder.Expr(`(component_name LIKE ? or page_name LIKE ?)`, args, args))
	}
	query, args, err := build.ToSQL()
	if err != nil {
		return nil, err
	}
	result, err := conn.QueryRowsNoType(query, args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return ids, nil
		}
		return nil, err
	}
	for i := range result {
		ids = append(ids, result[i]["id"].(int64))
	}
	return ids, nil
}

func filterIds(ids []int64, conn ckgroup.CKConn) ([]int64, error) {
	res := []int64{}
	if len(ids) == 0 {
		return res, nil
	}

	query := fmt.Sprintf(`select toInt64(temp_id) id
from (select page_group_id,
             length(temp_arr) =
             1 ? temp_arr[1].2:
             temp_arr[arrayFilter((i, platform)->platform = 'iOS', arrayEnumerate(temp_arr),
                                  temp_arr.1)[1]].2 temp_id
      from (select page_group_id, groupArray((platform, latest_id)) temp_arr
            from (select page_group_id, platform, max(id) latest_id
                  from trace_visual.element_info
                  where id in (%s)
                  group by page_group_id, platform)
            group by page_group_id))`, util.TurnInt64ListToStringWithComma(ids))

	result, err := conn.QueryRowsNoType(query)
	if err != nil {
		if err == sql.ErrNoRows {
			return res, nil
		}
		return nil, err
	}
	for i := range result {
		res = append(res, result[i]["id"].(int64))
	}
	return res, nil
}

func queryPages(req types.WebQueryPageRequest, ids []int64, conn ckgroup.CKConn) ([]*model.PageInfo, error) {
	infos := []*model.PageInfo{}
	if len(ids) == 0 {
		return infos, nil
	}
	query := buildPageSortSQL(ids, req.ModuleId, req.CurrentPage, req.PageSize)
	if err := conn.QueryRows(&infos, query); err != nil {
		return nil, err
	}
	return infos, nil
}

func buildPageSortSQL(ids []int64, moduleId, currentPage, pageSize int) string {
	selectElementSQL := fmt.Sprintf(`select id, platform, picture, page_name, page_id, page_group_id,page_module_id
      from trace_visual.element_info
      where id in (%s)`, util.TurnInt64ListToStringWithComma(ids))

	switch moduleId {
	case 0, -1:
		if moduleId == -1 {
			selectElementSQL += ` and page_module_id is null `
		}
		selectElementSQL += ` order by id desc`
		return fmt.Sprintf(`select t1.id, platform, picture, page_name, page_id, module_name,page_group_id
from (%s) t1
         left join (select id, module_name from trace_visual.module) t2 on t2.id = t1.page_module_id
 limit %d,%d`, selectElementSQL, (currentPage-1)*pageSize, pageSize)
	default:
		return fmt.Sprintf(`select id,
       platform,
       picture,
       page_name,
       page_id,
       page_module_id,
       page_group_id,
       module_name,
       n
from (%s) inner_t1
         join (select page_group_id, n, module_name
               from (select arrayJoin(arrayMap((x, y)-> (x, y), ids_arr, order_arr)) t,
                            t.1                                                      page_group_id,
                            t.2                                                      n,
                            module_name
                     from (select splitByString(',', assumeNotNull(page_order)) ids_arr,
                                  arrayEnumerate(ids_arr)                       order_arr,
                                  module_name
                           from trace_visual.module
                           where id = %d
                           limit 1)
                     where page_group_id != '')) inner_t2
              on inner_t1.page_group_id = inner_t2.page_group_id
order by n limit %d,%d`, selectElementSQL, moduleId, (currentPage-1)*pageSize, pageSize)
	}
}
