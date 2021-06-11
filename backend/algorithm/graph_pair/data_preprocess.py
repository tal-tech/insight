#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Dec  1 16:51:34 2020

@author: lzhforg
"""
from utils import findSubStr_clark
from get_data_sql import get_candidate_matchdata, get_required_matchdata
from log_json import base_code
from ocr.tools.infer.predict_system import predcit
from flask import request
#日志启动器
log = base_code(__name__)
def get_data(rowid):
    headdata=get_required_matchdata(rowid)
    if headdata == None:
        return headdata, [],[],[],[]
    else:
        print(headdata[2][:findSubStr_clark(headdata[2], ".", 3)])
        data=get_candidate_matchdata(headdata[2][:findSubStr_clark(headdata[2], ".", 3)],headdata[1])
        print(data)
        head_imageurl = headdata[0]
        log.info({"headimagename": headdata[3]})
        candidate_image_urllist = []
        candidate_idlist = []
        for i in data:
            candidate_image_urllist.append(i[1])
            candidate_idlist.append(i[2])
            log.info({"dataimagename": i[2]})
    return headdata, data,head_imageurl,candidate_image_urllist,candidate_idlist
