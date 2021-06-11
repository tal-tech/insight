# -*- coding: utf-8 -*-
import logging
import json
import datetime
import socket


class HostIp:
    host_name = None
    host_ip = None

    @classmethod
    def get_host_ip(cls):
        if not cls.host_name or not HostIp.host_ip:
            try:
                cls.host_name = socket.gethostname()
                cls.host_ip = socket.gethostbyname(cls.host_name)
            except ConnectionError:
                cls.host_name = "unknown hostname"
                cls.host_ip = "unknown ip"
        return cls.host_name, cls.host_ip


REMOVE_ATTR = [
    "filename", "module", "exc_text", "stack_info", "created", "msecs",
    "relativeCreated", "exc_info", "msg", "args", "levelno", "thread",
    "threadName", "processName", "process", "host_name", "funcName"
]


class JSONFormatter(logging.Formatter):
    host_name, host_ip = HostIp.get_host_ip()

    def format(self, record):
        extra = self.build_record(record)
        self.set_format_time(extra)  # set time
        self.set_host_ip(extra)  # set host name and host ip
        if isinstance(record.msg, dict):
            extra['data'] = record.msg  # set message
        else:
            if record.args:
                extra['msg'] = "'" + record.msg + "'," + str(
                    record.args).strip('()')
            else:
                extra['msg'] = record.msg
        # 重命名
        extra['level'] = extra.pop('levelname')
        extra['content'] = str({
            "name": extra.get('name', 'log_json'),
            "pathname": extra.get("pathname", None),
            "lineno": extra.get("lineno", None),
            "host_name": extra.get("host_name", None),
            "host_ip": extra.get("host_ip", None)
        })
        for n in ['name', 'pathname', 'lineno', 'host_ip', 'host_name']:
            del extra[n]
        if record.exc_info:
            extra[
                'msg'] = extra['msg'] + 'Error trance:' + self.formatException(
                    record.exc_info)
        if self._fmt == 'pretty':
            return json.dumps(extra, indent=1, ensure_ascii=False)
        else:
            return json.dumps(extra, ensure_ascii=False)

    @classmethod
    def build_record(cls, record):
        return {
            attr_name: record.__dict__[attr_name]
            for attr_name in record.__dict__ if attr_name not in REMOVE_ATTR
        }

    @classmethod
    def set_format_time(cls, extra):
        now = datetime.datetime.utcnow()
        format_time = now.strftime("%Y-%m-%dT%H:%M:%S" + ".%03d" %
                                   (now.microsecond / 1000) + "Z")
        extra['@timestamp'] = format_time
        return format_time

    @classmethod
    def set_host_ip(cls, extra):
        extra['host_name'] = JSONFormatter.host_name
        extra['host_ip'] = JSONFormatter.host_ip
