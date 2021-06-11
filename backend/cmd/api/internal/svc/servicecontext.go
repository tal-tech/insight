package svc

import (
	"tracking/cmd/api/internal/config"
	"tracking/cmd/api/internal/model"

	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"github.com/tal-tech/cds/pkg/ckgroup"
	"github.com/tal-tech/go-zero/core/stores/sqlx"
)

type ServiceContext struct {
	Config              config.Config
	OssClient           *oss.Client
	Bucket              *oss.Bucket
	MysqlConn           sqlx.SqlConn
	CkConn              ckgroup.CKConn
	ModuleModel         *model.ModuleModel
	ElementInfoModel    model.ElementInfoModel
	RelatedPageModel    *model.RelatedPageModel
	TraceDataModel      model.TraceDailyRecordModel
	TraceGroupModel     model.TraceGroupModel
	GroupedVersionModel model.GroupedVersionModel
	PageMatchChan       chan int64
}

func NewServiceContext(c config.Config) *ServiceContext {
	client, err := oss.New(c.OssEndpoint, c.OssAccessKey, c.OssSecret)
	if err != nil {
		panic("连接oss失败:" + err.Error())
	}
	bucket, err := client.Bucket(c.OssBucketName)
	if err != nil {
		panic("获取bucket失败:" + err.Error())
	}

	conn := sqlx.NewMysql(c.MysqlConn)
	ckConn := ckgroup.MustCKConn(c.CkConn)

	moduleModel := model.NewModuleModel(conn)
	relatedPageModel := model.NewRelatedPageModel(conn)
	traceDailyRecordModel := model.NewTraceDailyRecordModel(conn)
	groupModel := model.NewTraceGroupModel(conn)
	versionModel := model.NewGroupedVersionModel(conn)

	return &ServiceContext{
		Config:              c,
		OssClient:           client,
		Bucket:              bucket,
		MysqlConn:           conn,
		CkConn:              ckConn,
		ModuleModel:         moduleModel,
		ElementInfoModel:    model.NewElementInfoModel(conn, ckConn),
		RelatedPageModel:    relatedPageModel,
		TraceDataModel:      traceDailyRecordModel,
		TraceGroupModel:     groupModel,
		GroupedVersionModel: versionModel,
		PageMatchChan:       make(chan int64, 1000),
	}
}
