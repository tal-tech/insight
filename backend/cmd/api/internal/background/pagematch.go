package background

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"tracking/cmd/api/internal/svc"
	"tracking/cmd/api/internal/types"

	"github.com/tal-tech/go-zero/core/logx"
)

const (
	imageMatchPath = `/imagesimilarity`
)

var (
	platforms = []string{types.AndroidPlatform, types.IOSPlatform}
	ctx       *svc.ServiceContext
)

func Init(arg *svc.ServiceContext) {
	ctx = arg
}

func RequestMatchService(id int64, host string) {
	for i := 0; i < 3; i++ {
		now := time.Now()
		client := http.Client{Timeout: 5 * time.Minute}
		url := fmt.Sprint(host, imageMatchPath, `?id=`, id)
		response, err := client.Get(url)
		if err != nil {
			if strings.Contains(err.Error(), `Client.Timeout exceeded while awaiting headers`) {
				elapse := time.Now().Unix() - now.Unix()
				logx.Info("timeout elapse secondes:", elapse)
			}
			msg := fmt.Sprintf(
				" 环境:%s \n 服务:trace-visual \n 页面匹配请求失败 \n id:%d \n error:%s",
				ctx.Config.ServiceConf.Mode,
				id,
				err.Error(),
			)
			logx.Error(msg)
			return
		}
		switch response.StatusCode {
		case 200:
			response.Body.Close()
			return
		case 400:
			handler400(response, id, ctx.Config.ServiceConf.Mode, i)
		case 500:
			handler500(response, id, ctx.Config.ServiceConf.Mode, i)
			time.Sleep(3 * time.Second)
		default:
			handler400(response, id, ctx.Config.ServiceConf.Mode, 2)
			return
		}
	}
}

func handler400(response *http.Response, id int64, mode string, i int) {
	bytes, err := ioutil.ReadAll(response.Body)
	if err != nil {
		logx.Error("读取响应体错误:" + err.Error())
	}
	msg := fmt.Sprintf(
		" 环境:%s \n 服务:trace-visual \n 页面匹配返回异常 \n id:%d \n response code:%d \n response body:%s",
		mode,
		id,
		response.StatusCode,
		string(bytes),
	)
	logx.Error(msg)
}

func handler500(response *http.Response, id int64, mode string, i int) {
	msg := fmt.Sprintf(
		" 环境:%s \n 服务:trace-visual \n 页面匹配返回异常 \n id:%d \n response code:%d",
		mode,
		id,
		response.StatusCode,
	)
	response.Body.Close()
	logx.Error(msg)
}
