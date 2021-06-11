import webapi from "api/api"
import * as components from "./tracevisualComponents"
export * from "./tracevisualComponents"

/**
 * @description "添加元素/页面的截图,通过 header：'X-User-Id' 来鉴权"
 * @param req
 */
export function addElement(req: components.AddElementRequest) {
	return webapi.post<null>("/trace-visual/add-element", req)
}

/**
 * @description "修改元素的属性"
 * @param req
 */
export function updateElement(req: components.UpdateElementRequest) {
	return webapi.post<null>("/trace-visual/update-element", req)
}

/**
 * @description "数据录入端的查询接口"
 * @param req
 */
export function appQueryElement(req: components.AppQueryListRequest) {
	return webapi.post<components.AppQueryListResponse>("/trace-visual/app-query-list", req)
}

/**
 * @description "首页查询当前的页面"
 * @param req
 */
export function webQueryPage(req: components.WebQueryPageRequest) {
	return webapi.post<components.WebQueryPageResponse>("/trace-visual/web-query-page", req)
}

/**
 * @description "查询一个页面内所有元素的信息"
 * @param req
 */
export function queryPageDetail(req: components.QueryPageDetailRequest) {
	return webapi.post<components.QueryPageDetailResponse>("/trace-visual/query-page-detail", req)
}

/**
 * @description "修改页面名称"
 * @param req
 */
export function updatePageName(req: components.UpdatePageNameRequest) {
	return webapi.post<null>("/trace-visual/update-page-name", req)
}

/**
 * @description "修改页面的模块"
 * @param req
 */
export function updatePageModuleId(req: components.UpdatePageModuleIdRequest) {
	return webapi.post<null>("/trace-visual/update-page-moduleid", req)
}

/**
 * @description "页面拖拽排序"
 * @param req
 */
export function updatePageOrder(req: components.UpdatePageOrderRequest) {
	return webapi.post<null>("/trace-visual/update-page-order", req)
}

/**
 * @description "增加模块"
 * @param req
 */
export function addModule(req: components.AddModuleRequest) {
	return webapi.post<null>("/trace-visual/module/add-module", req)
}

/**
 * @description "修改模块"
 * @param req
 */
export function updateModule(req: components.UpdateModuleRequest) {
	return webapi.post<null>("/trace-visual/module/update-module", req)
}

/**
 * @description "删除模块"
 * @param req
 */
export function deleteModule(req: components.DeleteModuleRequest) {
	return webapi.post<null>("/trace-visual/module/delete-module", req)
}

/**
 * @description "查询模块"
 * @param req
 */
export function queryModuleList(req: components.QueryModuleListRequest) {
	return webapi.post<components.QueryModuleListResponse>("/trace-visual/module/query-module-list", req)
}

/**
 * @description "查询关联页面"
 * @param req
 */
export function queryRelatedPage(req: components.QueryRelatedPageRequest) {
	return webapi.post<components.QueryRelatedPageResponse>("/trace-visual/related-page/query-related-page", req)
}

/**
 * @description "根据埋点的path 查询这个埋点有没有数据"
 * @param req
 */
export function queryHasData(req: components.QueryHasDataRequest) {
	return webapi.post<components.QueryHasDataResponse>("/trace-visual/trace-data/query-has-data", req)
}

/**
 * @description "根据埋点的path 查询这个埋点7日数据 ， key 是秒级的时间戳 value 是数量"
 * @param req
 */
export function querySevenDatas(req: components.QuerySevenDataRequest) {
	return webapi.post<components.QuerySevenDataResponse>("/trace-visual/trace-data/query-seven-data", req)
}

/**
 * @description "根据 component,path 获取 trace 表中一条数据"
 * @param req
 */
export function queryOneTraceData(req: components.QueryOneDataRequest) {
	return webapi.post<components.QueryOneDataResponse>("/trace-visual/trace-data/query-one", req)
}

/**
 * @description "解除页面匹配"
 * @param req
 */
export function movePageMatch(req: components.MovePageMatchRequest) {
	return webapi.post<components.MovePageMatchResponse>("/trace-visual/alter/move-page-match", req)
}

/**
 * @description "删除页面埋点"
 * @param req
 */
export function deletePage(req: components.DeletePageRequest) {
	return webapi.post<null>("/trace-visual/alter/delete-page", req)
}

/**
 * @description "删除元素埋点"
 * @param req
 */
export function deleteTrace(req: components.DeleteTraceRequest) {
	return webapi.post<null>("/trace-visual/alter/delete-trace", req)
}

/**
 * @description "根据埋点的path 查询这个埋点有没有数据"
 * @param req
 */
export function insert(req: components.TraceGroupInsertRequest) {
	return webapi.post<null>("/trace-visual/trace-group/insert", req)
}

/**
 * @description "查询聚类结果"
 * @param req
 */
export function queryTraceGroup(req: components.QueryTraceGroupRequest) {
	return webapi.post<components.QueryTraceGroupResoponse>("/trace-visual/trace-group/query-group", req)
}
