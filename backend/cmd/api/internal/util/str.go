package util

import (
	"crypto/md5"
	"fmt"
	"io"
	"math/rand"
	"path"
	"strconv"
	"strings"
	"time"

	uuid "github.com/satori/go.uuid"
)

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
var uuidChars = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func RandString(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func FileName2Md5(name string) string {
	ext := path.Ext(name)
	withoutExt := strings.ReplaceAll(name, ext, "")
	hash := md5.New()
	_, _ = io.WriteString(hash, fmt.Sprint(withoutExt, time.Now().Unix()))
	newName := fmt.Sprintf("%x", hash.Sum(nil))
	return newName + ext
}

func RandBool() bool {
	rand.Seed(time.Now().UnixNano())

	n := rand.Intn(2)
	if n == 1 {
		return true
	} else {
		return false
	}
}

func ShortUUID() string {
	t1 := strings.ReplaceAll(uuid.NewV4().String(), `-`, ``)
	result := ""
	for i := 0; i < 8; i++ {
		sub := t1[i*4 : i*4+4]
		j, _ := strconv.ParseInt(sub, 16, 64)
		result += string(uuidChars[j%0x3E])
	}
	return result
}

func TurnInt64ListToStringWithComma(list []int64) string {
	if len(list) == 1 {
		return strconv.FormatInt(list[0], 10)
	}
	var result string
	for _, v := range list {
		result += strconv.FormatInt(v, 10) + ","
	}

	return result[0 : len(result)-1]
}
