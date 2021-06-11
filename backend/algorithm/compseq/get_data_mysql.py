import json
import pymysql


CONFIG = open('./config.json', 'r', encoding='utf8')
json_data = json.load(CONFIG)
sqlhost=json_data['host']
sqlport=json_data['port']
sqluser=json_data['user']
sqlpasswd=json_data['passwd']
sqldb=json_data['database']

clickhousehost=json_data['clickhousehost']
clickhousesqlport=json_data['clickhouseport']
clickhousesqluser=json_data['clickhouseuser']
clickhousesqlpasswd=json_data['clickhousepasswd']
clickhousesqldb=json_data['clickhousedatabase']

def get_mysql_connect():
    db = pymysql.connect(host=sqlhost,
                         port=sqlport,
                         user=sqluser,
                         passwd=sqlpasswd,
                         db=sqldb,
                         charset='utf8')
    cursor = db.cursor()
    return cursor,db

def get_latest_version(platform,db,cursor):
    sql="SELECT version,CONCAT(LPAD(SUBSTRING_INDEX(SUBSTRING_INDEX(version, '.', 1), '.', -1), 5, '0'),\
        LPAD(SUBSTRING_INDEX(SUBSTRING_INDEX(version, '.', 2), '.', -1), 5, '0'),\
        LPAD(SUBSTRING_INDEX(SUBSTRING_INDEX(version, '.', 3), '.', -1), 5, '0')) vcode\
        FROM element_info\
        where platform='"+platform+"'"+"having vcode <= CONCAT(LPAD(12,5,'0'), LPAD(0,5,'0'), LPAD(3,5,'0'))\
        order by vcode desc;"
    try:
        cursor.execute(sql)
        result=cursor.fetchall()
        db.commit()
    except:
        db.rollback()
    return result

def check_sql(component_name,version,os,db,cursor):
    sql="select id FROM related_page\
        where component_name='%s' and version='%s' and os='%s'" % (component_name,version,os)
    try:
        cursor.execute(sql)
        result=cursor.fetchall()
        db.commit()
    except:
        db.rollback()
    return result

def insert_sql(component_name,version,os,related_pages,db,cursor):
    
    sql = "Insert INTO related_page(component_name, version, os, related_pages) \
        VALUES ('%s', '%s', '%s', '%s')" % \
        (component_name,version,os,related_pages)
    try:
        cursor.execute(sql)
       # 提交到数据库执行
        db.commit()
    except:
        db.rollback()
        
def update_sql(insertid,component_name,version,os,related_pages,db,cursor):
    
    sql = "UPDATE  related_page SET (component_name, version, os, related_pages) \
            VALUES ('%s', '%s', '%s', '%s') where id=%d" \
        (component_name,version,os,related_pages,insertid)
    try:
        cursor.execute(sql)
       # 提交到数据库执行
        db.commit()
    except:
        db.rollback()
        