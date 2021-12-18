import React, { useEffect, useState } from 'react'
import { notiErr } from '../util/Authentication/Utils'
import './ControlScene.css'

export default function ControlScene(props) {
    const [errMsg, setErrMsg] = useState("")
    const [pressedUp, setPressUp] = useState(false)
    const [pressedDown, setPressDown] = useState(false)
    const [pressedRight, setPressRight] = useState(false)
    const [pressedLeft, setPressLeft] = useState(false)
    const [lastPress, setLastPress] = useState(0)
    const [ircWS, setIrcWS] = useState(null)

    const showNotiErr = msg => notiErr(msg, setErrMsg, () => setErrMsg(''))

    useEffect(() => {
        var profile = props.profile
        let token = profile['access_token']
        let nick = profile['username']

        if (!nick || !token) {
            console.log('control', location.href, location.href.replaceAll('/main', ''))
            // showNotiErr('Failed to login to IRC. Return to startup screen!')
            location.hash = '/'
            return
        }

        var ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')

        ws.onopen = e => {
            ws.send(`PASS oauth:${token}`)
            console.log(`< PASS oauth:${token}`)

            ws.send(`NICK ${nick}`)
            console.log(`< NICK ${nick}`)

            ws.send(`JOIN #nguyenntt`)
            console.log(`< JOIN #nguyenntt`)
        }

        ws.onmessage = e => {
            console.log(e.data)
        }

        ws.onerror = e => {
            showNotiErr(`${e}`)
        }

        setIrcWS(ws)
        return () => {
            ws.close()
        }
    }, [props.profile])

    const onKeyCommand = (cmd) => {
        let now = Date.now()
        if ((now - lastPress) > 1000) {
            setLastPress(now);
            if (ircWS.readyState === WebSocket.OPEN) {
                ircWS.send(`PRIVMSG #nguyenntt :${cmd}`)
                console.log(`< PRIVMSG #nguyenntt :${cmd}`)
            }
        }
    }

    const handleKeyDown = e => {
        // For references
        // http://blogs.longwin.com.tw/lifetype/key_codes.html
        if (pressedUp) return
        if (e.keyCode == 119 || e.keyCode == 87) {
            setPressUp(true)
            return
        }

        if (pressedDown) return
        if (e.keyCode == 115 || e.keyCode == 83) {
            setPressDown(true)
            return
        }

        if (pressedLeft) return
        if (e.keyCode == 97 || e.keyCode == 65) {
            setPressLeft(true)
            return
        }

        if (pressedRight) return
        if (e.keyCode == 100 || e.keyCode == 68) {
            setPressRight(true)
            return
        }
    }

    const handleKeyUp = e => {
        // For references
        // http://blogs.longwin.com.tw/lifetype/key_codes.html
        if (pressedUp) {
            onKeyCommand("!goUp")
            setPressUp(false);
        }
        if (pressedDown) {
            onKeyCommand("!goDown")
            setPressDown(false);
        }
        if (pressedLeft) {
            onKeyCommand("!goLeft")
            setPressLeft(false);
        }
        if (pressedRight) {
            onKeyCommand("!goRight")
            setPressRight(false);
        }

    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [handleKeyDown, handleKeyUp])

    return [
        <div key={0} id="snackbar" className={`${(errMsg.length !== 0) ? "show-bar" : ""}`}>{errMsg}</div>,
        <div key={1} className="control-board">
            <div key={1}>
                <span className={`material-icons ${pressedUp ? "pressed" : ""}`}>
                    W
                </span>
            </div>
            <div key={2}>
                <span key={1} className={`material-icons ${pressedLeft ? "pressed" : ""}`}>
                    A
                </span>
                <span key={2} className={`material-icons ${pressedDown ? "pressed" : ""}`}>
                    S
                </span>
                <span key={3} className={`material-icons ${pressedRight ? "pressed" : ""}`}>
                    D
                </span>
            </div>
        </div>,
        <div key={2} id="snackbar" className={`${(errMsg.length !== 0) ? "show-bar" : ""}`}> {errMsg}</div >
    ]
}