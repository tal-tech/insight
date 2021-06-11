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

func UpdatePageNameHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdatePageNameRequest
		if err := httpx.Parse(r, &req); err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		}
		if req.PageName == "" {
			baseresponse.HttpParamErrorWithRequest(w, r, errors.New("页面名称不能为空"))
			return
		}
		l := logic.NewUpdatePageNameLogic(r.Context(), ctx)
		err := l.UpdatePageName(req)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
		} else {
			baseresponse.FormatResponseWithRequest(nil, nil, w, r)
		}
	}
}
