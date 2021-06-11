package model

import (
	"fmt"
	"testing"

	"github.com/tal-tech/go-zero/core/stores/sqlx"
)

func Test_defaultElementInfoModel_UpdatePageGroupIdByPageId(t *testing.T) {
	conn := sqlx.NewMysql(``)
	table := "element_info"
	m := &defaultElementInfoModel{
		conn:  conn,
		table: table,
	}

	fmt.Println(m.UpdatePageGroupIdByPageId(`111`, `a_title_test`, `android`))
}
