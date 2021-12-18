import React, { useEffect, useState } from 'react';
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import StartupScene from './StartupScene';
import ControlScene from './ControlScene';
import { API_BASE, cloneIt, fetchApi, notiErr } from '../util/Authentication/Utils';
import MyAppBar from './AppBar';
import './Snackbar.css'

const getDefaultProfile = () => {
    return ({
        'user_id': null,
        'opaque_id': null,
        'ext_token': null,
        'client_id': null,
        'channel_id': null,
        'access_token': null,
        'username': null
    })
}

export default function MainScene() {
    const [errMsg, setErrMsg] = useState('')
    const [userProfile, setProfile] = useState(getDefaultProfile())

    console.log("MainScene", userProfile)

    let history = useHistory()

    return [
        <MyAppBar profile={userProfile} hist={history} onProfileStateChange={setProfile} />,
        (<Switch>
            <Route key='main' path="/main">
                <ControlScene profile={userProfile} hist={history} />
            </Route>
            <Route key='panel'>
                <StartupScene hist={history} profile={userProfile} />
            </Route>
        </Switch>),
        < div id="snackbar" className={`${(errMsg.length !== 0) ? "show-bar" : ""}`}> {errMsg}</div >
    ]
}