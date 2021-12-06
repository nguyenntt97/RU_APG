import {React, useEffect} from 'react';
import { useNavigate } from 'react-router';
import "./StartupScene.css";

function StartupScene() {
    let navigate = useNavigate()
    const handleKeyDown = (e) => {
        navigate('/main')
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
        </div>);
}

export default StartupScene;