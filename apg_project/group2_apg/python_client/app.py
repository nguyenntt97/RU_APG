from flask import Flask, request
from flask_cors import cross_origin, CORS

from cachelib.simple import SimpleCache
from time import time
import requests
import json

from flask_socketio import SocketIO

cache = SimpleCache()

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
socketio = SocketIO(app)

API_HOST = "https://dcaf-2001-ee0-5658-4510-cd9a-9afa-edf2-9bf9.ngrok.io"
SECRET = "sy81ffkh3kndon1ozcwga1nphuyhyk"
CLIENT_ID = "qwi88ymktf1qqjpnupb95egrhmj0um"

@app.route('/authorize')
@cross_origin()
def authorize():
    """
        Query code for token
    """
    opaque_id = request.args.get('opaque-id')
    data = cache.get(opaque_id)

    if data is None:
        return {"User not found"}, 400

    if 'expires_at' not in data:
        url = f'https://id.twitch.tv/oauth2/token?'\
            f'client_secret={SECRET}&'\
            f'client_id={CLIENT_ID}&'\
            f'code={data["code"]}&'\
            f'grant_type=authorization_code&'\
            f'redirect_uri={API_HOST}/oauth-authorized'

        print(url)
        rs = requests.post(url).json()
        data['access_token'] = rs['access_token']
        data['refresh_token'] = rs['refresh_token']
        data['expires_at'] = int(time()) + rs['expires_in'] * 1000

        cache.set(opaque_id, data, timeout=5*60)

    return data

@app.route('/oauth-authorized')
def oauth_authorized():
    """
        Get code for Twitch API token
    """

    opaque_id = request.args.get('state')
    code = request.args.get('code')
    rs = cache.set(opaque_id, {'code': code}, timeout=5*60)

    if rs:
        return {'msg': cache.get(opaque_id)}
    else:
        return "Failed to save", 400

def run():
    socketio.run(app)
