package baseresponse

import (
	"net/http"

	"github.com/tal-tech/go-zero/core/logx"
	"github.com/tal-tech/go-zero/rest/httpx"
)

const codeServiceUnavailable = 10001

var (
	serviceUnavailable = "服务器竟然开小差，一会儿再试试吧"
)

func FormatResponseWithRequest(data interface{}, err error, w http.ResponseWriter, r *http.Request) {
	if err != nil {
		codeErr, ok := FromError(err)
		if ok {
			httpBizError(w, codeErr)
		} else {
			httpServerError(w)
		}
		logx.WithContext(r.Context()).Error(err)
	} else {
		HttpOk(w, data)
	}
}

func HttpParamErrorWithRequest(w http.ResponseWriter, r *http.Request, err error) {
	logx.WithContext(r.Context()).Error(err)
	HttpParamError(w, err.Error())
}

func httpBizError(w http.ResponseWriter, err *CodeError) {
	HttpError(w, http.StatusNotAcceptable, err.Code(), err.Desc(), err.Data())
}

func httpServerError(w http.ResponseWriter) {
	HttpError(w, http.StatusInternalServerError, codeServiceUnavailable, serviceUnavailable, nil)
}

type response struct {
	Code    int64       `json:"code"`
	Desc    string      `json:"desc,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Message interface{} `json:"message,omitempty"`
}

func HttpError(w http.ResponseWriter, httpCode int, appCode int64, desc string, message interface{}) {
	httpx.WriteJson(w, httpCode, response{
		Code:    appCode,
		Desc:    desc,
		Message: message,
	})
}

func HttpOk(w http.ResponseWriter, data interface{}) {
	httpx.WriteJson(w, http.StatusOK, response{
		Data: data,
	})
}

func HttpParamError(w http.ResponseWriter, desc string) {
	httpx.WriteJson(w, http.StatusBadRequest, response{
		Code: http.StatusBadRequest,
		Desc: desc,
	})
}
