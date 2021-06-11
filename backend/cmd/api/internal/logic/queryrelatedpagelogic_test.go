package logic

import (
	"testing"
)

func Test_cutVersion(t *testing.T) {
	type args struct {
		version string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{args: args{version: "1.1.1.1"}, want: `1.1.1`},
		{args: args{version: "1.1.1."}, want: `1.1.1`},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := cutVersion(tt.args.version); got != tt.want {
				t.Errorf("cutVersion() = %v, want %v", got, tt.want)
			}
		})
	}
}
