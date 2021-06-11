package handler

import (
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	logic "tracking/cmd/api/internal/logic/tracealter"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func DeleteTraceHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.DeleteTraceRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := logic.NewDeleteTraceLogic(r.Context(), ctx)
		err := l.DeleteTrace(req)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
		} else {
			baseresponse.FormatResponseWithRequest(nil, nil, w, r)
		}
	}
}
