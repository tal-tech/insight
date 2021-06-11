#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Dec  1 16:51:34 2020

@author: lzhforg
"""
import time
from utils import stopwordslist
from log_json import base_code
import os
import numpy as np
import jieba_fast as jieba
from ocr.tools.infer.predict_system import predcit
from utils import read_img_url2cv
import cv2
import requests
from flask import request
import json

#日志启动器
log = base_code(__name__)
__dir__ = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.abspath(__dir__))
SIM_THRESHOLD=0.61
CONFIG = open('./config.json', 'r', encoding='utf8')

json_data = json.load(CONFIG)
sqlhost = json_data['host']
sqlport = json_data['port']
sqluser = json_data['user']
sqlpaawd = json_data['passwd']
sqldb = json_data['database']
httpport = json_data['httpport']
STOPWORD_DIR='./stopword.txt'
stopwords=stopwordslist(STOPWORD_DIR)

def deletestopword(content):
    temp = []
    for i in content:
        if i not in stopwords:
            temp.append(i)
    return temp


def get_word_vector(list_word1, list_word2):
    if len(list_word1) < len(list_word2):
        temp = list_word1
        list_word1 = list_word2
        list_word2 = temp
    key_word = list(set(list_word1 + list_word1))
    word_vector1 = np.zeros(len(key_word))
    word_vector2 = np.zeros(len(key_word))
    for i in range(len(key_word)):
        for j in range(len(list_word1)):
            if key_word[i] == list_word1[j]:
                word_vector1[i] += 1
        for k in range(len(list_word2)):
            if key_word[i] == list_word2[k]:
                word_vector2[i] += 1
    return word_vector1, word_vector2


def cos_dist(vec1, vec2):
    dist1 = float(
        np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))
    return dist1

def match_image(head_imageurl, candidate_image_urllist, candidate_idlist):
    w = 480
    h = 1060

    dataimglist = []
    scoremaxlist = []
    score = []
    sift = cv2.SIFT_create()
    

    headdataimg = read_img_url2cv(head_imageurl)
    headdataimg = cv2.resize(headdataimg, (w, h))
    kp1, des1 = sift.detectAndCompute(headdataimg, None)
    headdatastr = deletestopword(jieba.lcut(''.join(predcit(headdataimg))))

    os.chdir(os.path.abspath(__dir__))
    for j in candidate_image_urllist:
        dataimg = read_img_url2cv(j)
        dataimg = cv2.resize(dataimg, (w, h))
        dataimglist.append(dataimg)
        kp2, des2 = sift.detectAndCompute(dataimg, None)
        ratio = 0.9
        matcher = cv2.BFMatcher()
        if type(des2) != type(des1):
            score.append(0)
            continue
        raw_matches = matcher.knnMatch(des1, des2, k=2)
        good_matches = []
        for m1, m2 in raw_matches:
            if m1.distance < ratio * m2.distance:
                good_matches.append([m1])
        score.append(len(good_matches))
    scoremaxlist.append(np.argmax(score))
    datastr = deletestopword(
        jieba.lcut(''.join(predcit(dataimglist[np.argmax(score)]))))

    v1, v2 = get_word_vector(headdatastr, datastr)

    cosscore = cos_dist(v1, v2)
    log.info({
        'headstr': headdatastr,
        'datastr': datastr,
        'cossstore': cosscore
    })
    if cosscore > SIM_THRESHOLD:
        os.chdir(os.path.abspath(__dir__))
        return candidate_idlist[np.argmax(score)]
    else:
        for i in range(len(dataimglist)):
            datastr = deletestopword(
                jieba.lcut(''.join(predcit(dataimglist[i]))))
            v1, v2 = get_word_vector(headdatastr, datastr)
            cosscore = cos_dist(v1, v2)
            log.info({
                'headstr': headdatastr,
                'datastr': datastr,
                'cossstore': cosscore
            })
            if cosscore > SIM_THRESHOLD:
                os.chdir(os.path.abspath(__dir__))
                return candidate_idlist[i]
    os.chdir(os.path.abspath(__dir__))
    return 0