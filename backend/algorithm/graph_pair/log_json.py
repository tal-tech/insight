# -*- coding: utf-8 -*-
import logging.config
from json_formatter import JSONFormatter
import sys


def base_code(name):
    log = logging.getLogger(name)
    log.setLevel(logging.DEBUG)

    # write log to file
    handler = logging.FileHandler("log/grapgpair.log")
    handler.setLevel(logging.INFO)
    # write log to console
    handler_console = logging.StreamHandler(sys.stdout)
    handler_console.setLevel(logging.INFO)
    # set formatter
    handler.setFormatter(JSONFormatter())
    handler_console.setFormatter(JSONFormatter("no"))
    # add handler
    log.addHandler(handler)
    log.addHandler(handler_console)
    return log
