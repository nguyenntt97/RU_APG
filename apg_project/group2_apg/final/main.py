import logging
import sys

from asyncio.events import AbstractEventLoop
from asyncio.tasks import create_task
from overseer import capture, get_score
import requests
import threading
from twitchio.ext import commands
import win32gui
import win32api
import win32con

import asyncio
import time

from ctypes import windll

from overseer_t import run

logging.basicConfig(
    stream=sys.stdout,
    format='[%(asctime)s] {%(filename)s:%(lineno)d} %(levelname)s - %(message)s',
    level=logging.INFO)


class Bot(commands.Bot):
    is_ready = False

    def __init__(self, window_handler=None):
        self.hwnd = window_handler
        # Initialise our Bot with our access token, prefix and a list of channels to join on boot...
        super().__init__(token='oauth:60jeclq4fu9031b4ffxidnd2r5jxgp',
                         prefix=['!', '~'], initial_channels=['nguyenntt'])

    async def event_ready(self):
        # We are logged in and ready to chat and use commands...
        print(f'Logged in as | {self.nick}')
        self.is_ready = True

    @commands.command()
    async def goUp(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_UP,
                             int(0x01480001))
        time.sleep(0.2)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_UP,
                             int(0xC1480001))
        return 0

    @commands.command()
    async def goRight(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_RIGHT,
                             int(0x01480001))
        time.sleep(0.2)

        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_RIGHT,
                             int(0xC1480001))
        return 0

    @commands.command()
    async def goLeft(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_LEFT,
                             int(0x01480001))
        time.sleep(0.2)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_LEFT,
                             int(0xC1480001))
        return 0

    @commands.command()
    async def goDown(self, ctx: commands.Context):
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYDOWN,
                             win32con.VK_DOWN,
                             int(0x01480001))
        time.sleep(0.2)
        win32api.PostMessage(self.hwnd,
                             win32con.WM_KEYUP,
                             win32con.VK_DOWN,
                             int(0xC1480001))
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


cur_player = None
last_scores = [0, 0]


async def track_round(bot: Bot):
    global cur_player
    global last_scores
    logging.info('track_round running - END_ROUND ...')
    res = requests.get('https://apg-api-g2.herokuapp.com/round')

    if res.status_code != 200:
        logging.error(f'Election failed, err=%s', res.text)
        return False

    new_player = res.text
    if bot.is_ready:
        ws = bot.get_channel('nguyenntt')
        if cur_player:
            await ws.send(f'?end {cur_player} {int(last_scores[1]) - int(last_scores[0])}')

        await ws.send(f'?elect {new_player}')
        cur_player = new_player
        return True

    return False


score_post_count = 0


async def track_score(hwnd, bot):
    global last_scores
    global score_post_count
    score_post_count += 1

    logging.info(f"score_task running...")

    img = capture(hwnd)
    scores = get_score(img)

    if scores is None:
        return

    if (scores[0] and scores[1]):
        last_scores = [scores[0], scores[1]]

    if score_post_count % 5 == 0:
        score_post_count = 1
        requests.post('https://apg-api-g2.herokuapp.com/score',
                      data={
                          'pm': scores[0],
                          'gh': scores[1]
                      })
    if bot.is_ready:
        ws = bot.get_channel('nguyenntt')
        await ws.send(f'?score {scores[0]} {scores[1]}')
        return True


async def track_tasks(hwnd, bot: Bot):
    i = 0
    while True:
        await track_score(hwnd, bot)

        if not i % 10:
            if await track_round(bot):
                i = 0
            else:
                i -= 1  # retry

        await asyncio.sleep(3)
        i += 1


def create_daemon(ev_loop: AbstractEventLoop, hwnd, bot: Bot):
    logging.info("Creating daemon tasks...")
    asyncio.set_event_loop(ev_loop)
    task = asyncio \
        .get_event_loop() \
        .create_task(track_tasks(hwnd, bot))

    try:
        ev_loop.run_until_complete(task)
    except asyncio.CancelledError as e:
        logging.error(f"Error: {e.__cause__}")
    except KeyboardInterrupt:
        logging.error("Interrupted!!!")
    except Exception as e:
        logging.exception(e)


def main():
    try:
        event_loop_score = asyncio.new_event_loop()

        hwnd = win32gui.FindWindow(0, 'Pacman')
        bot = Bot(hwnd)

        threading.Thread(
            target=create_daemon,
            args=(event_loop_score, hwnd, bot),
            daemon=True).start()

        threading.Thread(
            target=run,
            args=(hwnd,),
            daemon=True).start()

        bot.run()
    except KeyboardInterrupt:
        print('Interrupted!!!')


if __name__ == '__main__':
    main()
