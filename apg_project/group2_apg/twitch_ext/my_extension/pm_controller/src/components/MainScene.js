import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

import StartupScene from './StartupScene';
import MyAppBar from './AppBar';

function MainScene() {
    return [
        <MyAppBar />,
        <Router>
            <Routes>
                <Route exact path="/" element={<StartupScene />} />
            </Routes>
        </Router>
    ]
}

export default MainScene;