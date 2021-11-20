import React from 'react';
import "./StartupScene.css";

function StartupScene() {
    return (<div className="start-stage">
        <div className="title">MS-PACMAN</div>
        <div className="pacman">
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
        <div className="press-enter">PRESS ANY TO START</div>
    </div>);
}

export default StartupScene;