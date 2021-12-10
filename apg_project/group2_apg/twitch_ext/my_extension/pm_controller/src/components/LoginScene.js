import React from 'react';

function LoginScene() {
    const siteUrl = location.protocol + '//' + location.host;

    let url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&response_type=token&scope=chat:edit&redirect_uri=${siteUrl}`
    window.location.href = url;
    return (
        <div></div>
    );
}

export default LoginScene;