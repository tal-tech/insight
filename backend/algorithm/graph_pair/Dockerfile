FROM python:3.7.1-stretch


ADD . /service
WORKDIR /service
RUN pip config set global.index-url http://mirrors.aliyun.com/pypi/simple
RUN pip config set install.trusted-host mirrors.aliyun.com

RUN pip  install common
RUN pip  install dual
RUN pip  install tight
RUN pip  install data
RUN pip  install prox

RUN pip install -r requirements.txt


RUN chmod 777 ./server.py
