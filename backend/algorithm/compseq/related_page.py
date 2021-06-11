# -*- coding: utf-8 -*-
import csv
from get_data_clickhouse import select_trace_clickhouse
from utils import search_n
from get_data_mysql import check_sql, get_latest_version, get_mysql_connect, insert_sql, update_sql
import pickle
import numpy as np
import datetime
import time
import pymysql
import json
from log_json import base_code
#日志启动器
log=base_code()



def mergedata(datatemp,version,os):
    data=[]
    databatch=[]
    for i in range(len(datatemp)-1):
        
        if datatemp[i][0]!=datatemp[i+1][0]:
            databatch.append(datatemp[i][1])
            if len(databatch)>3:
                data.append(databatch)
            databatch=[]
            continue
            
        if datatemp[i][1]==datatemp[i+1][1]:
            databatch.append(datatemp[i][1])
            if len(databatch)>3:
                data.append(databatch)
            databatch=[]
            continue
        date1=datatemp[i][2]
        date2=datatemp[i+1][2]
        timediff=(date2-date1).total_seconds()
            
        if timediff>86400:
            databatch.append(datatemp[i][1])
            if len(databatch)>3:
                data.append(databatch)
                continue
        databatch.append(datatemp[i][1])
    page={}
    for i in data:
        for j in range(len(i)-1):
            if i[j] in page.keys():
                if i[j-1] in page[i[j]].keys():
                    page[i[j]][i[j-1]]=page[i[j]][i[j-1]]+1
                else:
                    page[i[j]][i[j-1]]=1
            else:
                page[i[j]]={}
                page[i[j]][i[j-1]]=1
    
    for i in page.keys():
        path=[]
        temp=sorted(page[i].items(), key = lambda kv:(kv[1], kv[0]))
        sumresult=0
        for j in temp:
            sumresult+=j[1]
        for j in temp:
            if(j[1]/sumresult>0.0006):
                path.append(j[0])
            else:
                break
        path.reverse()
        if(len(path)>0):
            strpath=str(path)
            strpath=strpath.replace('\'','')
            strpath=strpath[1:-1]
            if check_sql(i,version,os,db,cursor)==None:
                insert_sql(i,version,os,strpath,db,cursor)
            else:
                update_sql(check_sql(i,version,os),i,version,os,strpath,db,cursor)


if __name__ == "__main__":
    config=open('./config.json','r',encoding='utf8')
    json_data = json.load(config)
    cursor,db=get_mysql_connect()

    androidversion=get_latest_version('android',db,cursor)[0][0]
    iosversion=get_latest_version('iOS',db,cursor)[0][0]
    iosversion='%'+iosversion[:search_n(iosversion,'.',3)]+'%'
    androidversion='%'+androidversion[:search_n(androidversion,'.',3)]+'%'

    androiddata=select_trace_clickhouse(androidversion,'android')
    iosdata=select_trace_clickhouse(iosversion,'iOS')

    mergedata(androiddata,androidversion,'android')
    mergedata(iosdata,iosversion,'iOS')




