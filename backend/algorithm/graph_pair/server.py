#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Dec  1 16:51:34 2020

@author: lzhforg
"""
from get_data_sql import update_data_sql
from match_pic import match_image
from data_preprocess import get_data
from log_json import base_code
import os
from flask import Flask
import jieba_fast as jieba
from flask import request
import json

#日志启动器
__dir__ = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.abspath(__dir__))
log = base_code(__name__)

CONFIG = open('./config.json', 'r', encoding='utf8')
json_data = json.load(CONFIG)
httpport = json_data['httpport']
app = Flask(__name__)

@app.route('/imagesimilarity', methods=['GET'])
def handlehttp():
    try:
        row_id = request.args.get('id')
        (headdata, data,head_imageurl,candidate_image_urllist,candidate_idlist)=get_data(row_id)
        if headdata == None:
            log.error({"selecterror": ("Didn't get image from rowid ",row_id)})
            return "rowid:%s not matched because there is no matching row"%(row_id), 400
        elif len(data) == 0:
            log.info("rowid:%s not matched because there is no legal object to be matched"%(row_id))
            return "finish"
        sim = match_image(head_imageurl, candidate_image_urllist, candidate_idlist)
        if sim == 0:
            log.info("rowid:" + row_id +
                     " not matched because there is no match picture")
            return "finish"
        pagename = sim
        for i in data:
            if i[2] == pagename:
                datagroup = i[3]
        update_data_sql(headdata[4], pagename, datagroup, headdata[3],
                        headdata[5])

        return "finish"
    except Exception as e:
        log.error({"error": str(e)})
        log.error({"errorline": str(e.__traceback__.tb_lineno)})
        return str(e), 400

def main():
    try:
        app.run(host='0.0.0.0', port=httpport)
    except Exception as e:
        log.error({"error": str(e)})
if __name__ == "__main__":
    jieba.lcut("初始化jieba")
    main()

