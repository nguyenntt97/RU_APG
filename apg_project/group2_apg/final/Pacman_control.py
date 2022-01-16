import win32gui # pip install pywin32 
import win32api
import win32con
import time
from ctypes import windll

sleep = 0.1

key_map = {
    'A': ord('A'),
    'D': ord('D'),
    'W': ord('W'),
    'S': ord('S'),
}

class Pacman:
    def __init__(self, window_handler=None):
        self.hwnd = window_handler


    def goUp(self):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             key_map['W'],
                             int(0x01480001))
        time.sleep(sleep)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             key_map['W'],
                             int(0xC1480001))
        time.sleep(sleep)
        return 0

    def goRight(self):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             key_map['D'],
                             int(0x01480001))
        time.sleep(sleep)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             key_map['D'],
                             int(0xC1480001))
        time.sleep(sleep)
        return 0


    def goLeft(self):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             key_map['A'],
                             int(0x01480001))
        time.sleep(sleep)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             key_map['A'],
                             int(0xC1480001))
        time.sleep(sleep)
        return 0

    def goDown(self):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             key_map['S'],
                             int(0x01480001))
        time.sleep(sleep)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             key_map['S'],
                             int(0xC1480001))
        time.sleep(sleep)
        return 0

def main():
    hwnd = win32gui.FindWindow(0, 'Pacman')
    bot = Bot(hwnd)
    while True:
        bot.goRight()

if __name__ == '__main__':
    main()
