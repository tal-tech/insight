package handler

import (
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	logic "tracking/cmd/api/internal/logic/tracegroup"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func QueryTraceGroupHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.QueryTraceGroupRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := logic.NewQueryTraceGroupLogic(r.Context(), ctx)
		resp, err := l.QueryTraceGroup(req)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
		} else {
			baseresponse.FormatResponseWithRequest(resp, nil, w, r)
		}
	}
}
