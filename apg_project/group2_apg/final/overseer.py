import win32gui
import win32ui
from pytesseract import image_to_string
import requests
from ctypes import windll
from PIL import Image, ImageEnhance, ImageFilter
import time

import re
import numpy as np
import cv2

import socketio

sio = socketio.Client(logger=True, engineio_logger=True)


def capture(hwnd):
    left, top, right, bot = win32gui.GetClientRect(hwnd)
    w = right - left
    h = bot - top

    hwndDC = win32gui.GetWindowDC(hwnd)
    mfcDC = win32ui.CreateDCFromHandle(hwndDC)
    saveDC = mfcDC.CreateCompatibleDC()

    saveBitMap = win32ui.CreateBitmap()
    saveBitMap.CreateCompatibleBitmap(mfcDC, w, h)

    saveDC.SelectObject(saveBitMap)
    result = windll.user32.PrintWindow(hwnd, saveDC.GetSafeHdc(), 1)

    if (result == 1):
        bmpinfo = saveBitMap.GetInfo()
        bmpstr = saveBitMap.GetBitmapBits(True)

        im = Image.frombuffer(
            'RGB',
            (bmpinfo['bmWidth'], bmpinfo['bmHeight']),
            bmpstr, 'raw', 'BGRX', 0, 1)

        win32gui.DeleteObject(saveBitMap.GetHandle())
        saveDC.DeleteDC()
        mfcDC.DeleteDC()
        win32gui.ReleaseDC(hwnd, hwndDC)

        return im

    return None


def get_score(img):
    pattern = re.compile('^SCORE:\\s[\\d]+\\sGHOST SCORE:\\s[\\d]+$')

    img = np.array(img)
    img = 255 - (img[480:, :, 0] + img[480:, :, 1])
    score_text = image_to_string(img)
    if score_text:
        score_text = score_text.strip()
        if pattern.match(score_text) is None:
            return None
        score_text = score_text.replace('SCORE:', '')
        score_text = score_text.replace('GHOST', '')

    return score_text.split()

def main():
    hwnd = win32gui.FindWindow(0, "Pacman")

    round = 0
    i = 0
    while True:
        i += 1
        img = capture(hwnd)
        time.sleep(0.5)
        if (not i % 10):
            i = 0
            round += 1
            get_score(img)
                
        # cv2.imshow('screen', img)

        if (cv2.waitKey(1) & 0xFF) == ord('q'):
            cv2.destroyAllWindows()
            break


if __name__ == '__main__':
    main()
