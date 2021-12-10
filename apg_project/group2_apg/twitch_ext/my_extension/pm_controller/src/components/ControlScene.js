import React, { useEffect, useState } from 'react'
import './ControlScene.css'

export default function ControlScene() {
    const [errMsg, setErrMsg] = useState("")
    const [pressedUp, setPressUp] = useState(false)
    const [pressedDown, setPressDown] = useState(false)
    const [pressedRight, setPressRight] = useState(false)
    const [pressedLeft, setPressLeft] = useState(false)
    const [lastPress, setLastPress] = useState(0)

    const onKeyCommand = (cmd) => {
        let now = Date.now()
        if ((now - lastPress) > 1000) {
            setLastPress(now);

            // let reqOpt = {
            //     method: 'POST',
            //     headers: {
            //         "Authorization": "Bearer " + token,
            //         "Client-ID": clientId,
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         "text": cmd
            //     })
            // }

            // fetch(
            //     "https://api.twitch.tv/extensions/" +
            //     clientId +
            //     "/0.0.1/channels/" +
            //     channelId +
            //     "/chat", reqOpt)
            //     .then(res => {
            //         if (!res.ok) {
            //             if (res.status == 429) {
            //                 setErrMsg("Code " + res.status + ": Too many request")
            //             }
            //             let timer = setTimeout(() => {
            //                 setErrMsg("")
            //                 clearTimeout(timer)
            //             }, 5000)
            //         }
            //     })
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
    }, [handleKeyDown])

    return [
        <div id="snackbar" className={`${(errMsg.length !== 0) ? "show-bar" : ""}`}>{errMsg}</div>,
        <div className="control-board">
            <div>
                <span class={`material-icons ${pressedUp ? "pressed" : ""}`}>
                    W
                </span>
            </div>
            <div>
                <span class={`material-icons ${pressedLeft ? "pressed" : ""}`}>
                    A
                </span>
                <span class={`material-icons ${pressedDown ? "pressed" : ""}`}>
                    S
                </span>
                <span class={`material-icons ${pressedRight ? "pressed" : ""}`}>
                    D
                </span>
            </div>
        </div>
    ]
}