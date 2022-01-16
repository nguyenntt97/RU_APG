import win32gui
import win32ui
from ctypes import windll
from PIL import Image

import numpy as np
import cv2
from AI_PACMAN import AI_PACMAN
from Pacman_control import Pacman
import asyncio


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


def run(hwnd):
    Pac_control = Pacman(hwnd)
    AI = AI_PACMAN()
    skip = 5
    i = 0
    while True:
        img = capture(hwnd)
        im_rgb = cv2.cvtColor(np.array(img)[:480,:480], cv2.COLOR_BGR2RGB)
        if i > skip:
            move = AI.run(im_rgb)
            # print(move)
            if move == "right":
                Pac_control.goRight()
            elif move == "left":
                Pac_control.goLeft()
            elif move == "up":
                Pac_control.goUp()
            else:
                Pac_control.goDown()
            i = 0
        i = i + 1


async def main():
    hwnd = win32gui.FindWindow(0, "Pacman")
    Pac_control = Pacman(hwnd)
    AI = AI_PACMAN()
    skip = 5
    i = 0
    while True:
        img = capture(hwnd)
        im_rgb = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)
        if i > skip:
            move = AI.run(im_rgb)
            print(move)
            if move == "right":
                Pac_control.goRight()
            elif move == "left":
                Pac_control.goLeft()
            elif move == "up":
                Pac_control.goUp()
            else:
                Pac_control.goDown()
            i = 0
        i = i + 1
        await asyncio.sleep(1)


if __name__ == '__main__':
    main()
