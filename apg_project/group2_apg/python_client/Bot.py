from os import system
import socket
import sys
from time import sleep
from threading import Thread


class IRC:
    irc = socket.socket()

    def __init__(self):
        self.irc = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def send_line(self, line):
        self.irc.send(bytearray(line, 'utf-8'))

    def connect(self, server):
        # defines the socket
        print("connecting to:" + server)
        self.irc.connect((server, 6667))  # connects to the server

    def get_text(self):
        text = self.irc.recv(2040).decode('utf-8')  # receive the text

        if text.find('PING') != -1:
            self.irc.send(text.replace('PING', 'PONG'))
            return None

        return text

    def login(self, channel, botnick, auth_token):
        t = f"PASS oauth:{auth_token}\r\n"
        self.send_line(t)
        print(t)

        t = f"NICK {botnick}\r\n"
        self.send_line(t)
        print(t)

        t = f"JOIN #{channel}\r\n"
        self.send_line(t)  # join the chan
        print(t)


    def send(self, channel, msg):
        self.send_line(f"PRIVMSG #{channel} :{msg}\r\n")


def polling(irc):
    while True:
        res = irc.irc.recv(4096).decode('utf-8')
        if (res is not None and len(res) > 0):
            print(res)
        else:
            sleep(10)
        


def main():
    irc = IRC()
    irc.connect("irc.chat.twitch.tv")

    polling_thread = Thread(target=polling, args=(irc, ))
    polling_thread.start()

    irc.login(
        "nguyenntt",
        "rohirrim3105",
        "wctyn716jxixvoroug35pajdovfdrb"
    )

    irc.send("nguyenntt", "hi my man")
    irc.send("nguyenntt", "what's up")
    
    sleep(5)

    # polling_thread.join()



if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        # do nothing here
        pass
