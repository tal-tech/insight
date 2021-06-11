package handler

import (
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	"tracking/cmd/api/internal/logic"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func DeleteModuleHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.DeleteModuleRequest
		if err := httpx.Parse(r, &req); err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		}

		l := logic.NewDeleteModuleLogic(r.Context(), ctx)
		userId, err := GetUserId(r)
		if err != nil {
			baseresponse.FormatResponseWithRequest(nil,
				err, w, r)
			return
		}
		err = l.DeleteModule(req, userId)
		baseresponse.FormatResponseWithRequest(nil, err, w, r)
	}
}
