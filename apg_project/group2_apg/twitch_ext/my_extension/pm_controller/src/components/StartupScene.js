import React, { useEffect } from 'react';
import "./StartupScene.css";

export default function StartupScene(props) {
    const handleKeyDown = e => {
        props.hist.push('/panel.html/main')
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
    })

    return (
        <div className="start-stage">
            <div className="title">MS-PACMAN</div>
            <div className="pacman">
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
            <div className="press-enter">PRESS ANY TO START</div>
        </div>
    );
}