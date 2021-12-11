import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

import StartupScene from './StartupScene';
import MyAppBar from './AppBar';
import LoginScene from './LoginScene';

function MainScene() {
    return [
        <Router>
            <MyAppBar />
            <Routes>
                <Route path="/" element={<StartupScene />} />
                <Route path="/panel" element={<StartupScene />} />
                <Route path="/login" element={<LoginScene />} />
            </Routes>
        </Router>
    ]
}

export default MainScene;