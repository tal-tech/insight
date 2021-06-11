import time
from clickhouse_driver import Client as click_client


def click_server(ip: str,
                 user: str,
                 pwd: str,
                 port='',
                 databases='',
                 query=''):
    chs_host = ip
    chs_user = user
    chs_pwd = pwd
    chs_port = port
    chs_database = databases
    client = click_client(host=chs_host,
                          port=chs_port,
                          user=chs_user,
                          password=chs_pwd,
                          database=chs_database,
                          send_receive_timeout=5)
    ans = client.execute(query=query, with_column_types=True)
    return ans


def select_trace_clickhouse(version, os,clickhousehost,clickhouseport,clickhouseuser,clickhousepasswd,clickhousedatabase):
    sql = "select user_id,component_name,create_time\
        from trace_all\
        where create_time >= parseDateTimeBestEffort('" + time.strftime(
        "%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 172800)
    ) + "')and create_time < parseDateTimeBestEffort('" + time.strftime(
        "%Y-%m-%d %H:%M:%S", time.localtime(time.time())) + "' ) \
        and blackboard_version like '" + version + "' \
        and os = '" + os + "'\
        and user_id!=''\
        and type=1 \
        order by  user_id,create_time\
        limit 30000000"

    print(sql)
    data = click_server(clickhousehost,
                        clickhouseuser,
                        clickhousepasswd,
                        clickhouseport,
                        clickhousedatabase,
                        query=sql)

    return data[0]
