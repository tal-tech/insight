#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Dec  1 16:51:34 2020

@author: lzhforg
"""
import os
import pymysql
from ocr.tools.infer.predict_system import predcit
from log_json import base_code
import json

#日志启动器
log = base_code(__name__)
__dir__ = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.abspath(__dir__))

config = open('./config.json', 'r', encoding='utf8')
json_data = json.load(config)
sqlhost = json_data['host']
sqlport = json_data['port']
sqluser = json_data['user']
sqlpasswd = json_data['passwd']
sqldb = json_data['database']
httpport = json_data['httpport']
stopworddir = './stopword.txt'

def get_mysql_connect():
    db = pymysql.connect(host=sqlhost,
                         port=sqlport,
                         user=sqluser,
                         passwd=sqlpasswd,
                         db=sqldb,
                         charset='utf8')
    cursor = db.cursor()
    return cursor,db

def get_required_matchdata(rowid):
    cursor,db=get_mysql_connect()
    rowidsql = ("SELECT picture,platform,version,page_id,page_group_id,page_module_id "
    "FROM element_info "
    "where id=%s "
    "and android_ios_relation is NULL "
    "and is_page=1;"
    )%(rowid)
    cursor.execute(rowidsql)
    matchhead = cursor.fetchone()
    log.info({"rowidsql": rowidsql})
    db.close()
    return matchhead

def get_candidate_matchdata(app_version,platform):
    cursor,db=get_mysql_connect()
    if platform=='iOS':
        platform='android'
    else:
        platform='iOS'
    print(app_version,platform)
    getsql = ("SELECT id,picture,page_id,page_group_id "
        "FROM element_info "
        "where version like '%s%%' "
        "and platform='%s' "
        "and android_ios_relation is  NULL "
        "and is_page=1;"
    )%(app_version,platform)
    print(getsql)
    log.info({"selectsql": getsql})
    cursor.execute(getsql)
    data = cursor.fetchall()
    db.close()
    return data

def update_data_sql(headgroup, headrelation, datagroup, datarelation,
                    page_module_id):
    cursor,db=get_mysql_connect()
    headupdataesql = "UPDATE  element_info  SET android_ios_relation='%s' where page_group_id='%s';"%(headrelation,headgroup)
    dataupdatesql =("UPDATE  element_info SET android_ios_relation='%s', page_group_id='%s',"
        " page_module_id='%s' where page_group_id='%s';")%(datarelation,headgroup,str(page_module_id),datagroup)
    try:
        log.info({"updatesql": headupdataesql})
        log.info({"updatesql": dataupdatesql})
        cursor.execute(headupdataesql)
        cursor.execute(dataupdatesql)
    except Exception as e:
        log.error({"updateerror": str(e)})
        db.rollback()
    else:
        db.commit()
        log.info({"updatesql": headupdataesql + "\\\\\\" + dataupdatesql})
    return