# Trace Visual

埋点可视化的后端 Http Server，用来存储 iOS 和 Android 上传的埋点信息。

### 项目依赖

* MySQL 5.7
* ClickHouse 19+
* 阿里云OSS


### 启动方式
```shell
go run tracevisual.go -f config.yaml
```

### 配置文件说明

```yaml
Name: tracevisual-api
Host: 0.0.0.0
Port: 8888
# 阿里oss的endpoint
OssEndpoint: oss-cn-hangzhou.aliyuncs.com
# 阿里oss的access key
OssAccessKey: aaaaaaa
# 阿里oss的 secret key
OssSecret: bbbbbbbb
# 阿里oss的 bucket name
OssBucketName: own-name
# 阿里oss的 下载url
OssDownLoadUrl: http://localhost
# python 算法的接口地址
ImageMatchHost: http://localhost:11111
# mysql 连接串
MysqlConn: root:root@tcp(localhost:3306)/trace_visual?parseTime=true&loc=Local
# clickhouse 连接串
CkConn: tcp://localhost:9000?username=root&password=root&database=db&debug=true&parseTime=true&loc=Asia%2FShanghai
```
### 其他
[详细介绍](流程和概念.md)
