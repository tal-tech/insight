package handler

import (
	"errors"
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	"tracking/cmd/api/internal/logic"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func UpdateElementHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdateElementRequest
		if err := httpx.Parse(r, &req); err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		}
		if req.TraceName != nil && (*req.TraceName) == "" {
			baseresponse.HttpParamErrorWithRequest(w, r, errors.New("埋点名称不能是空"))
			return
		}
		l := logic.NewUpdateElementLogic(r.Context(), ctx)
		err := l.UpdateElement(req)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		} else {
			baseresponse.FormatResponseWithRequest(nil, nil, w, r)
			return
		}
	}
}
