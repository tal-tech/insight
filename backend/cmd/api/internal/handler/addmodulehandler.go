package handler

import (
	"errors"
	"net/http"
	"strconv"

	"tracking/cmd/api/internal/baseresponse"
	"tracking/cmd/api/internal/logic"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func AddModuleHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.AddModuleRequest
		if err := httpx.Parse(r, &req); err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
			return
		}

		l := logic.NewAddModuleLogic(r.Context(), ctx)

		userId, err := GetUserId(r)
		if err != nil {
			baseresponse.FormatResponseWithRequest(nil,
				err, w, r)
			return
		}
		err = l.AddModule(req, userId)
		baseresponse.FormatResponseWithRequest(nil,
			err, w, r)
	}
}

func GetUserId(r *http.Request) (int64, error) {
	temp := r.Header.Get(`X-User-Id`)
	if temp == "" {
		return 0, errors.New("user id is empty")
	}

	userId, err := strconv.ParseInt(temp, 10, 64)
	if err != nil {
		return 0, err
	}

	return userId, nil
}
