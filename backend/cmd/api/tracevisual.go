package main

import (
	"flag"
	"fmt"

	"tracking/cmd/api/internal/background"
	"tracking/cmd/api/internal/config"
	"tracking/cmd/api/internal/handler"
	"tracking/cmd/api/internal/svc"

	"github.com/tal-tech/go-zero/core/conf"
	"github.com/tal-tech/go-zero/core/logx"
	"github.com/tal-tech/go-zero/rest"
)

var configFile = flag.String("f", "etc/tracevisual-api.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)

	ctx := svc.NewServiceContext(c)
	server := rest.MustNewServer(c.RestConf)
	defer server.Stop()

	handler.RegisterHandlers(server, ctx)
	fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)
	background.Init(ctx)
	go pageMatch(ctx.PageMatchChan, c.ImageMatchHost)

	server.Start()
}

func pageMatch(ch chan int64, host string) {
	for id := range ch {
		logx.Info("request page match id:", id)
		background.RequestMatchService(id, host)
	}
}
