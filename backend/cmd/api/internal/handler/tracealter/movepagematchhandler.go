package handler

import (
	"net/http"

	"tracking/cmd/api/internal/baseresponse"
	logic "tracking/cmd/api/internal/logic/tracealter"
	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/rest/httpx"
)

func MovePageMatchHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.MovePageMatchRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := logic.NewMovePageMatchLogic(r.Context(), ctx)
		response, err := l.MovePageMatch(req)
		if err != nil {
			baseresponse.HttpParamErrorWithRequest(w, r, err)
		} else {
			baseresponse.FormatResponseWithRequest(response, nil, w, r)
		}
	}
}
