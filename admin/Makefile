export PATH := $(shell pwd)/node_modules/.bin:$(PATH)
.PHONY: init dev  build clean api

# 项目初始化
init:
	yarn

# 开发模式
dev:init
	yarn run start

# build到online环境
build:clean
	yarn
	npm run build
	tar -czf dist.tar.gz dist

clean:
	rm -rf dist

