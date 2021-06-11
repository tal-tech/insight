package util

import (
	"database/sql"
	"fmt"
	"testing"
)

func TestRandString(t *testing.T) {
	for i := 0; i < 10; i++ {
		fmt.Println(RandString(3))
	}
}

func TestFileName2Md5(t *testing.T) {
	fmt.Println(FileName2Md5("abc.mp3"))
}

func TestSQL(t *testing.T) {
	open, _ := sql.Open(``, ``)
	fmt.Println(open)
}

func TestRandBool(t *testing.T) {
	for i := 0; i < 10; i++ {
		fmt.Println(RandBool())
	}
}

func TestShortUUID(t *testing.T) {
	for i := 0; i < 100; i++ {
		fmt.Println(ShortUUID())
	}
}
