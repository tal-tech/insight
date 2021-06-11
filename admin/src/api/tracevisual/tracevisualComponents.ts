// Code generated by goctl. DO NOT EDIT.

export interface Position {
	xStart: number // 取值范围0-10000 。 以左上为原点，元素百分比坐标，比如元素在x轴的92.5%，取值为9250
	yStart: number
	xEnd: number
	yEnd: number
}

export interface AddElementRequest {
	appId: string // 哪个应用
	platform: string // 平台
	version: string // app 版本
	componentName: string
	path?: string
	name?: string
	picture: string // 元素截图的 base64 编码 ，如果是页面则是页面截图
	fullPicture?: string // 元素所属页面的截图  ，如果是页面，该字段为空
	position?: Position
	isPage: boolean
	pageTitle: string // 页面的 title
	isOverride?: boolean // 是否覆盖记录
}

export interface AppQueryListRequest {
	appId: string // 哪个应用
	platform: string // 平台
	version: string // app 版本
}

export interface AppQueryResponseItem {
	isPage: boolean
	componentName: string
	path?: string
	position?: Position
	name: string // 用户填写的埋点名称
}

export interface AppQueryListResponse {
	items: Array<AppQueryResponseItem>
}

export interface AddModuleRequest {
	moduleName: string
}

export interface DeleteModuleRequest {
	id: number
}

export interface QueryModuleListRequest {
	moduleName?: string
}

export interface QueryModuleListResponse {
	moduleList: Array<Module>
}

export interface Module {
	id: number
	moduleName: string
}

export interface WebQueryPageRequest {
	moduleId?: number
	searchStr?: string
	currentPage: number
	pageSize?: number
}

export interface WebQueryPageItem {
	platform: string
	pageUrl: string
	pageName: string
	pageModuleName: string
	pageId: string
	pageGroupId: string
}

export interface WebQueryPageResponse {
	pages: Array<WebQueryPageItem>
}

export interface UpdateElementRequest {
	id: number
	traceName?: string
}

export interface UpdatePageNameRequest {
	pageGroupId: string
	pageName: string
}

export interface UpdatePageModuleIdRequest {
	pageGroupId: string
	pageModuleId?: number // 0是全部 ，-1是未分类
}

export interface UpdatePageOrderRequest {
	moduleId: number
	pageGroupIds: Array<string>
}

export interface QueryPageDetailRequest {
	pageGroupId: string
}

export interface QueryPageDetailResponse {
	androidElements: { [key: string]: ElementTree } // map的key 是 version
	androidId: number
	androidPageInfo: { [key: string]: PageTraceInfo }
	iosElements: { [key: string]: ElementTree }
	iosId: number
	iosPageInfo: { [key: string]: PageTraceInfo }
}

export interface PageTraceInfo {
	pageId: string
	pageName: string
	componentName: string
	id: number
	picture: string
}

export interface ElementTree {
	traceName: string
	traceType: string
	componentName: string
	path: string // 和componentName 拼在一起就是埋点的全路经
	subPath: string
	id: number // 埋点的主键 id
	picture: string // 元素的截图
	fullPicture: string // 元素所在页面的截图
	position: Position // 位置信息
	children: Array<ElementTree>
}

export interface QueryRelatedPageRequest {
	id: number
	currentPage: number
	pageSize?: number
}

export interface QueryRelatedPageResponse {
	pages: Array<WebQueryPageItem>
}

export interface RelatedPageItem {
	picture: string
	id: number
}

export interface UpdateModuleRequest {
	moduleId: number
	moduleName: string
}

export interface QueryHasDataRequest {
	id: number
}

export interface QueryHasDataResponse {
	has: boolean
}

export interface QuerySevenDataRequest {
	id: number
}

export interface QueryOneDataRequest {
	id: number
}

export interface QueryOneDataResponse {
	data: { [key: string]: any }
}

export interface QuerySevenDataResponse {
	data: { [key: string]: number }
}

export interface MovePageMatchRequest {
	pageGroupId: string
	platform: string
}

export interface MovePageMatchResponse {
	newPageGroupId: string
}

export interface DeletePageRequest {
	pageId: string
	platform: string
	version: string
}

export interface DeleteTraceRequest {
	componentName: string
	path: string
	version: string
	platform: string
	isAllVersion: boolean // 是否删除所有的版本，如果该字段true，version 的值无效
}

export interface ElementGroup {
	componentName: string
	platform: string // 平台
	traceType: number
	currentElementPath: string
	currentAppVersion: string
	oldElementPath: string
	oldAppVersion: string
}

export interface ElementItem {
	componentName: string
	platform: string // 平台
	traceType: number
	currentAppVersion: string
	elementPath: string
}

export interface TraceGroupInsertRequest {
	elementChange?: Array<ElementGroup>
	elementNew?: Array<ElementItem>
	elementUnchanged: Array<ElementItem>
}

export interface QueryTraceGroupRequest {
	id: number
}

export interface QueryTraceGroupResoponse {
	groupId: string
	groups: { [key: string]: string } // key是版本号，value是路径
}
