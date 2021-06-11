package oss

import (
	"bytes"
	"fmt"

	"tracking/cmd/api/internal/util"

	"github.com/aliyun/aliyun-oss-go-sdk/oss"
)

func Upload(bucket *oss.Bucket, data []byte) (string, error) {
	objKey := fmt.Sprint(util.RandString(3), "/", util.FileName2Md5(util.RandString(10)))
	err := bucket.PutObject(objKey, bytes.NewReader(data))
	if err != nil {
		return "", err
	}
	return objKey, nil
}
