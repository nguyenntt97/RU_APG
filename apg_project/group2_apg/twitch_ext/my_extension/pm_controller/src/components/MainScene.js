import React, { useEffect, useState } from 'react';
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import StartupScene from './StartupScene';
import ControlScene from './ControlScene';
import { API_BASE, DEFAULT_CLIENT_ID, DEFAULT_OPAQUE_ID } from '../util/Authentication/Utils';
import MyAppBar from './AppBar';
import './Snackbar.css'

export default function MainScene() {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    const [errMsg, setErrMsg] = useState('')

    const [userProfile, setProfile] = useState({
        'opaque_id': DEFAULT_OPAQUE_ID,
        'ext_token': '',
        'client_id': DEFAULT_CLIENT_ID,
        'channel_id': '',
        'access_token': ''
    })

    if (twitch) {
        useEffect(() => {
            let uri = `${API_BASE}/authorize?opaque-id=${userProfile['opaque_id']}`
            fetch(uri)
                .then(rs => rs.json())
                .then(rs => {
                    console.log(rs['access_token'])
                    userProfile['access_token'] = rs['access_token']
                    userProfile['expires_at'] = rs['expires_at']
                    setProfile(userProfile)
                })
                .catch(err => {
                    setErrMsg(`${err}`)
                    const timer = setTimeout(() => {
                        setErrMsg('')
                        clearTimeout(timer)
                    }, 5000)
                })

            twitch.onAuthorized((auth) => {
                userProfile['opaque_id'] = auth.userId
                userProfile['ext_token'] = auth.token
                userProfile['client_id'] = auth.clientId
                userProfile['channel_id'] = auth.channelId
                setProfile(profile)
            })
        }, [])
    }


    let history = useHistory()

    return [
        <MyAppBar profile={userProfile} />,
        <Switch>
            <Route key='panel' exact path="/panel.html">
                <StartupScene hist={history} />
            </Route>
            <Route key='main' path="/panel.html/main">
                <ControlScene />
            </Route>
            <Route key='startup'>
                <StartupScene hist={history} />
            </Route>
        </Switch>,
        <div id="snackbar" className={`${(errMsg.length !== 0) ? "show-bar" : ""}`}>{errMsg}</div>
    ]
}