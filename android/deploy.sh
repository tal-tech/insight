#!/bin/bash

export RP_BASE_DIR=$(cd "$(dirname "$0")"; pwd)

export TARGET_PROJECTS=(
	"hunter-event-library"
	"hunter-event-plugin"
)

__gradle_exec(){
	g=../../gradlew
	if [[ -x $g ]];
		then
			$g ${@};
		else
			gradle ${@};
	fi;
}

__rp_deploy_project(){
	[[ ! -d ${1} ]] && echo ">>> INVALID ${1}!!! <<<" && return
	# execute deploying
	echo ">>> ${1} <<<" && cd ${1} && __gradle_exec -p ${1} uploadArchives
}

#rp_revert_AppConstant(){
#	git status -s | sed s/^...// | grep '/AppConstant.groovy' | git checkout ${f}
#}

rp_deploy(){
	local current=`pwd` && cd ${RP_BASE_DIR}
	# revert AppConstant.groovy
	# rp_revert_AppConstant
	# saving all changes: git stash save "saving stash for deploying!!!"

	# deploy
	for p in ${TARGET_PROJECTS[@]}; do __rp_deploy_project ${RP_BASE_DIR}/${p}; done
	# revert local changes: git revert --hard HEAD; git stash pop
	# rp_revert_AppConstant
	# back
	cd "${current}"
}

rp_deploy
