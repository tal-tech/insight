package handler

import (
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	logic "tracking/cmd/api/internal/logic/tracedata"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func QueryHasDataHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.QueryHasDataRequest
		if err := httpx.Parse(r, &req); err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		}

		l := logic.NewQueryHasDataLogic(r.Context(), ctx)
		resp, err := l.QueryHasData(req)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
		} else {
			baseresponse.FormatResponseWithRequest(resp, nil, w, r)
		}
	}
}
