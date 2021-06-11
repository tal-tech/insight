package logic

import (
	"testing"
)

func Test_repacePrefix(t *testing.T) {
	type args struct {
		prefix  string
		fullStr string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{args: args{prefix: "123", fullStr: `abcdefg`}, want: `123defg`},
		{args: args{prefix: "123", fullStr: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`}, want: `123aaaaaaaaaaaaaaaaaaaaaaaaaaaa`},
		{args: args{prefix: "", fullStr: `aaa`}, want: `aaa`},
		{args: args{prefix: "", fullStr: ``}, want: ``},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := repacePrefix(tt.args.prefix, tt.args.fullStr); got != tt.want {
				t.Errorf("repacePrefix() = %v, want %v", got, tt.want)
			}
		})
	}
}
