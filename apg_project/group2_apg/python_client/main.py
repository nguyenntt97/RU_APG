from twitchio.ext import commands
import win32gui
import win32ui
import win32api
import win32con


import time
from ctypes import windll


class Bot(commands.Bot):
    def __init__(self, window_handler=None):
        self.hwnd = window_handler
        # Initialise our Bot with our access token, prefix and a list of channels to join on boot...
        super().__init__(token='oauth:60jeclq4fu9031b4ffxidnd2r5jxgp',
                         prefix='!', initial_channels=['nguyenntt'])

    async def event_ready(self):
        # We are logged in and ready to chat and use commands...
        print(f'Logged in as | {self.nick}')

    @commands.command()
    async def goUp(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_UP, 
                             int(0x01480001))
        time.sleep(1)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_UP,
                             int(0xC1480001))
        time.sleep(1)
        return 0

    @commands.command()
    async def goRight(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_RIGHT,
                             int(0x01480001))
        time.sleep(1)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_RIGHT,
                             int(0xC1480001))
        time.sleep(1)
        return 0

    @commands.command()
    async def goLeft(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_LEFT,
                             int(0x01480001))
        time.sleep(1)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_LEFT,
                             int(0xC1480001))
        time.sleep(1)
        return 0

    @commands.command()
    async def goDown(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_DOWN,
                             int(0x01480001))
        time.sleep(1)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_DOWN,
                             int(0xC1480001))
        time.sleep(1)
        return 0

    @commands.command()
    async def hello(self, ctx: commands.Context):
        # Send a hello back!
        await ctx.send(f'Hello {ctx.author.name}!')

    async def event_message(self, message):
        if message.echo:
            return
        print(f'Said {message.content}')

        await self.handle_commands(message)


def main():
    hwnd = win32gui.FindWindow(0, 'Pacman')

    # win32api.PostMessage(hwnd, win32con.WM_KEYDOWN,
    #                      win32con.VK_UP, int(0x01480001))
    # time.sleep(1)
    # win32api.PostMessage(hwnd, win32con.WM_KEYUP,
    #                      win32con.VK_UP, int(0xC1480001))
    # # win32api.SendMessage(hwnd, win32con.WM_KEYDOWN, win32con.VK_UP, hex(0x01480001))
    # # win32api.SendMessage(hwnd, win32con.WM_KEYUP, win32con.VK_UP, hex(0xC1480001))
    # print("Go up")
    # time.sleep(1)

    # # win32api.SendMessage(hwnd, win32con.WM_KEYDOWN, win32con.VK_LEFT, 0)
    # # win32api.SendMessage(hwnd, win32con.WM_KEYUP, 0, 0)

    # win32api.PostMessage(hwnd, win32con.WM_KEYDOWN,
    #                      win32con.VK_LEFT, int(0x014B0001))
    # time.sleep(1)
    # win32api.PostMessage(hwnd, win32con.WM_KEYUP,
    #                      win32con.VK_LEFT, int(0xC14B0001))
    # print("Go left")

    bot = Bot(hwnd)
    bot.run()


if __name__ == '__main__':
    main()
