package handler

import (
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	"tracking/cmd/api/internal/logic"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func QueryModuleListHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.QueryModuleListRequest
		if err := httpx.Parse(r, &req); err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		}

		l := logic.NewQueryModuleListLogic(r.Context(), ctx)
		userId, err := GetUserId(r)
		if err != nil {
			baseresponse.FormatResponseWithRequest(nil,
				err, w, r)
			return
		}
		resp, err := l.QueryModuleList(req, userId)
		baseresponse.FormatResponseWithRequest(resp, err, w, r)
	}
}
