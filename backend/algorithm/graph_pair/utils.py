from PIL import Image
import cv2
import requests
import numpy as np
def stopwordslist(stopworddir):
    stopwords = [
        line.strip()
        for line in open(stopworddir, encoding='UTF-8').readlines()
    ]
    return stopwords

def findSubStr_clark(sourceStr, str, i):
    count = 0
    rs = 0
    for c in sourceStr:
        rs = rs + 1
        if (c == str):
            count = count + 1
        if (count == i):
            return rs

def read_img_url2cv(url):
    image = Image.open(requests.get(url, stream=True).raw)
    img = cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2BGR)
    return img