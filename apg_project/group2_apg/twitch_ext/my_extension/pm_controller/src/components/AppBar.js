import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './AppBar.css'
import { API_BASE, API_CLIENT_ID, cloneIt, fetchApi } from '../util/Authentication/Utils';

const doLogin = (opaqueId, onLoggedIn, onError) => {
	let uri = `${API_BASE}/authorize?opaque-id=${opaqueId}`
	fetchApi(uri)
		.then(onLoggedIn)
		.catch(onError)
}

export default function MyAppBar(props) {
	const twitch = window.Twitch ? window.Twitch.ext : null;

	const api_client = API_CLIENT_ID
	const scopes = "chat:read chat:edit"
	let setProfile = props.onProfileStateChange
	const [displayName, setDisplayName] = useState('')

	const loginHandler = useCallback(() => {
		const siteUrl = `${API_BASE}/oauth-authorized`;
		let userId = props.profile.user_id

		if (!userId)
			return

		let url = `https://id.twitch.tv/oauth2/authorize?
				state=${userId}&
				client_id=${api_client}&
				response_type=code&
				scope=${encodeURI(scopes)}&
				redirect_uri=${encodeURIComponent(siteUrl)}`

		let authWind = window.open('/panel.html', 'Signin', 'height=600, width=450')

		if (window.focus) {
			authWind.focus()
		}

		authWind.location.href = url
		let handleAuthClosed = setInterval(() => {
			if (authWind.closed) {
				console.log('Logged in redirect', location.href)
				clearInterval(handleAuthClosed)
				location.hash = 'main'
				doLogin(props.profile['user_id'],
					rs => {
						let newProfile = cloneIt(props.profile)
						newProfile['access_token'] = rs['access_token']
						newProfile['expires_at'] = rs['expires_at']
						newProfile['username'] = rs['username']
						setProfile(newProfile)
					}, err => {
						console.log(`Login Error: ${err}`)
					})
			}
		}, 1000)
	}, [props.profile])

	useEffect(() => {
		if (twitch) {
			twitch.actions.requestIdShare()
			twitch.onAuthorized(auth => {
				console.log("Authozing twitch", auth)
				let newProfile = cloneIt(props.profile)

				newProfile['opaque_id'] = auth.userId
				newProfile['ext_token'] = auth.token
				newProfile['client_id'] = auth.clientId
				newProfile['channel_id'] = auth.channelId

				if (twitch.viewer.id) {
					newProfile['user_id'] = twitch.viewer.id
				} else {
					newProfile['user_id'] = auth.userId.replace('U', '')
				}
				setProfile(newProfile)
			})
		}
	}, [])

	useEffect(() => {
		let newProfile = props.profile
		if (!newProfile['user_id']) return

		doLogin(newProfile['user_id'], rs => {
			setProfile(p => {
				let newProfile = cloneIt(p)
				newProfile['access_token'] = rs['access_token']
				newProfile['expires_at'] = rs['expires_at']
				newProfile['username'] = rs['username']
				newProfile['score'] = parseInt(rs['score'])

				return newProfile
			})
		}, err => {
			console.log(`Login Error: ${err}`)
		})

		console.log("Authozing profile", newProfile)
	}, [props.profile.user_id])

	console.log("AppBar", props.profile)

	useEffect(() => {
		let userName = props.profile.username
		let userId = props.profile.user_id
		let opaqueId = props.profile.opaque_id

		if (!opaqueId) return
		console.log("Change display name", props.profile)

		if (userName) {
			setDisplayName(`user ${userName}`)
		} else if (userId) {
			setDisplayName(`guest ${userId.substring(0, 5)}`)
		} else if (opaqueId) {
			setDisplayName(`n.a. ${opaqueId.substring(0, 5)}`)
		}
	}, [props.profile.user_id, props.profile.username])

	if (props.profile.user_id) {
		return (
			<div className="App-bar">
				<div><Link to="/">Group 2</Link></div>
				<div>{props.profile.userName ? displayName : [displayName, <span>&nbsp;(<a onClick={loginHandler}>Login</a>)</span>]}</div>
			</div>
		);
	} else {
		return "Loading..."
	}
}
