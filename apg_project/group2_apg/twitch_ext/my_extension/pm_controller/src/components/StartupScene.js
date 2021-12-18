import React, { useEffect, useState } from 'react';
import { notiErr } from '../util/Authentication/Utils';
import "./StartupScene.css";

export default function StartupScene(props) {
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        const showNotiErr = msg => notiErr(msg, setErrMsg, () => setErrMsg(''))
        const handleKeyDown = e => {
            if (!props.profile.username) {
                showNotiErr('Please login!')
                return
            }
            location.hash = 'main'
        }

        console.log("Rerender Startup", props.profile)
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [props.profile])

    return (
        <div className="start-stage">
            <div className="title">MS-PACMAN</div>
            <div className="pacman">
                <div key={1} />
                <div key={2} />
                <div key={3} />
                <div key={4} />
                <div key={5} />
            </div>
            <div className="press-enter">PRESS ANY TO START</div>
            < div id="snackbar" className={`${(errMsg.length !== 0) ? "show-bar" : ""}`}> {errMsg}</div >
        </div>
    );
}