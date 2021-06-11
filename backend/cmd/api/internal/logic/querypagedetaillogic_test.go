package logic

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"testing"

	"tracking/cmd/api/internal/model"
	"tracking/cmd/api/internal/types"
)

func TestFunc(t *testing.T) {
	traces := []*model.PageItemDetailItem{
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/AispeechMessageCell[0,6]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/AispeechMessageCell[0,6]/UITableViewCellContentView[0]/UIView[0]/UIView[3]/UIButton[1]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/EndedWeeklyOralCalculationMessageCell[0,7]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/SystemMessageCell[0,2]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/SystemMessageCell[0,3]", Valid: true}},
		{Path: sql.NullString{String: "", Valid: true}},
		// {Path: sql.NullString{String: "8/b/f", Valid: true}},
	} // {Path: sql.NullString{String: "a/b/f", Valid: true}}

	tree, _ := toTree(traces, "iOS")
	marshal, err := json.Marshal(tree)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(marshal))
}

func TestDelete(t *testing.T) {
	strs := []string{"a", "b", "c"}
	subSQL := ""
	for i := range strs {
		if i == 0 {
			subSQL += "((? like concat(page_id,'%')) or "
		} else if i == len(strs)-1 {
			subSQL += "(? like concat(page_id,'%')))"
		} else {
			subSQL += "(? like concat(page_id,'%')) or "
		}
	}
	fmt.Println(subSQL)

}

func TestLen(t *testing.T) {
	m := map[string]string{"x": ""}
	fmt.Println(len(m))
}

func Test_reduceTree(t *testing.T) {
	traces := []*model.PageItemDetailItem{
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/AispeechMessageCell[0,6]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/AispeechMessageCell[0,6]/UITableViewCellContentView[0]/UIView[0]/UIView[3]/UIButton[1]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/EndedWeeklyOralCalculationMessageCell[0,7]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/SystemMessageCell[0,2]", Valid: true}},
		{Path: sql.NullString{String: "NSKVONotifying_UITableView[0]/SystemMessageCell[0,3]", Valid: true}},
		{Path: sql.NullString{String: "", Valid: true}},
		// {Path: sql.NullString{String: "8/b/f", Valid: true}},
	} // {Path: sql.NullString{String: "a/b/f", Valid: true}}

	tree, err := toTree(traces, types.AndroidPlatform)
	if err != nil {
		panic(err)
	}
	t1, _ := json.Marshal(tree)
	fmt.Println(string(t1))
	reduceTree(tree, nil, 0)
	fmt.Println("--------------------------------------")
	t2, _ := json.Marshal(tree)
	fmt.Println(string(t2))
}

func Test_splitPath(t *testing.T) {
	fmt.Println(splitPath(types.AndroidPlatform, `ListView[0]/UserHeaderView[0]/SkinCompatLinearLayout[0]/SkinCompatFrameLayout[0]/SkinCompatRelativeLayout[0]/AvatarImageView[1]#iv_user/AvatarImageView#iv_user`))
}
