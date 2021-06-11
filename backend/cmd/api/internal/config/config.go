package config

import (
	"github.com/tal-tech/go-zero/rest"
)

type Config struct {
	rest.RestConf
	MysqlConn      string
	CkConn         string
	ImageMatchHost string
	OssEndpoint    string
	OssAccessKey   string
	OssSecret      string
	OssBucketName  string
	OssDownLoadUrl string
}
