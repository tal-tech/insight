package handler

import (
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	"tracking/cmd/api/internal/logic"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func UpdatePageOrderHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdatePageOrderRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := logic.NewUpdatePageOrderLogic(r.Context(), ctx)
		err := l.UpdatePageOrder(req)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
		} else {
			baseresponse.FormatResponseWithRequest(nil, nil, w, r)
		}
	}
}
