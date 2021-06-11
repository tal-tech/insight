package handler

import (
	"net/http"

	tracealter "tracking/cmd/api/internal/handler/tracealter"
	tracedata "tracking/cmd/api/internal/handler/tracedata"
	tracegroup "tracking/cmd/api/internal/handler/tracegroup"
	"tracking/cmd/api/internal/svc"

	"github.com/tal-tech/go-zero/rest"
)

func RegisterHandlers(engine *rest.Server, serverCtx *svc.ServiceContext) {
	engine.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/add-element",
				Handler: AddElementHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/update-element",
				Handler: UpdateElementHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/app-query-list",
				Handler: AppQueryElementHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/web-query-page",
				Handler: WebQueryPageHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/query-page-detail",
				Handler: QueryPageDetailHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/update-page-name",
				Handler: UpdatePageNameHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/update-page-moduleid",
				Handler: UpdatePageModuleIdHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/update-page-order",
				Handler: UpdatePageOrderHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/module/add-module",
				Handler: AddModuleHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/module/update-module",
				Handler: UpdateModuleHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/module/delete-module",
				Handler: DeleteModuleHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/module/query-module-list",
				Handler: QueryModuleListHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/related-page/query-related-page",
				Handler: QueryRelatedPageHandler(serverCtx),
			},
		},
	)

	engine.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/trace-data/query-has-data",
				Handler: tracedata.QueryHasDataHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/trace-data/query-seven-data",
				Handler: tracedata.QuerySevenDatasHandler(serverCtx),
			},
		},
	)

	engine.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/alter/move-page-match",
				Handler: tracealter.MovePageMatchHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/alter/delete-page",
				Handler: tracealter.DeletePageHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/alter/delete-trace",
				Handler: tracealter.DeleteTraceHandler(serverCtx),
			},
		},
	)

	engine.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/trace-group/insert",
				Handler: tracegroup.InsertHandler(serverCtx),
			},
			{
				Method:  http.MethodPost,
				Path:    "/trace-visual/trace-group/query-group",
				Handler: tracegroup.QueryTraceGroupHandler(serverCtx),
			},
		},
	)
}
