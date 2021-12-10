import React, { useEffect, useState } from 'react';

import './AppBar.css'
import { Link } from 'react-router-dom';
import { API_BASE } from '../util/Authentication/Utils';

export default function MyAppBar(props) {
	const [userId, setUserId] = useState('')

	useEffect(() => {
		let profile = props.profile
		setUserId(profile['opaque_id'])
	}, [props.profile])

	return (
		<div className="App-bar">
			<div><Link to="/panel.html">Group 2</Link></div>
			<div>{userId ? userId : ["Guest", (<a onClick={e => {
				const siteUrl = `${API_BASE}/oauth-authorized`;

				let url = `https://id.twitch.tv/oauth2/authorize?state=${profile['opaque_id']}&client_id=${profile['client_id']}&response_type=code&scope=${encodeURI("chat:read chat:edit")}&redirect_uri=${encodeURIComponent(siteUrl)}`

				let authWind = window.open('/panel.html', 'Signin', 'height=600, width=450')

				if (window.focus) {
					authWind.focus()
				}

				authWind.location.href = url
				let handleAuthClosed = setInterval(() => {
					if (authWind.closed) {
						location.href = '/panel.html'
						clearInterval(handleAuthClosed)
					}
				}, 1000)
			}}>Login</a>)]}</div>
		</div>
	);
}
