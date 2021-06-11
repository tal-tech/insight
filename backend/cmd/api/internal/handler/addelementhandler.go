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

func AddElementHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.AddElementRequest
		if err := httpx.Parse(r, &req); err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		}
		userId := r.Header.Get(`X-User-Id`)

		if req.Path == "" && !req.IsPage {
			baseresponse.HttpParamErrorWithRequest(w, r, errors.New("元素的 path 不能为空"))
			return
		}

		l := logic.NewAddElementLogic(r.Context(), ctx)
		err := l.AddElement(req, userId)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
		} else {
			baseresponse.FormatResponseWithRequest(nil, nil, w, r)
		}
	}
}
