export PATH := $(shell pwd)/node_modules/.bin:$(PATH)

# 项目初始化
init:
	yarn

dev:init
	yarn run dev

build:clean
	yarn
	yarn run build:prod

publish: build
	npm version patch
	npm publish
	git add  .
	git push

clean:
	rm -rf dist
