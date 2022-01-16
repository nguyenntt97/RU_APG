import React, { useEffect, useState } from 'react'
import { fetchApi, notiErr } from '../util/Authentication/Utils'
import './ControlScene.css'
import RankingBoard from './RankingBoard'
import ScoreBoard from './Scoreboard'

export default function ControlScene(props) {
    const [rankScore, setRankScore] = useState([])
    const [gameScore, setGameScore] = useState([0, 0])
    const [userScore, setUserScore] = useState(0)
    const [pmBet, setPmBet] = useState(0)
    const [ghostBet, setGhostBet] = useState(0)
    const [isPlayer, setBePlayer] = useState(false)
    const [connected, setConnected] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [pressedUp, setPressUp] = useState(false)
    const [pressedDown, setPressDown] = useState(false)
    const [pressedRight, setPressRight] = useState(false)
    const [pressedLeft, setPressLeft] = useState(false)
    const [lastPress, setLastPress] = useState(0)
    const [chatCmd, setChatCmd] = useState(null)
    const [ircWS, setIrcWS] = useState(null)

    const showNotiErr = msg => notiErr(msg, setErrMsg, () => setErrMsg(''))

    useEffect(() => {
        console.log('Restart websocket', connected)
        var profile = props.profile
        let token = profile['access_token']
        let nick = profile['username']

        if (!nick || !token) {
            console.log('control', location.href, location.href.replaceAll('/main', ''))
            // showNotiErr('Failed to login to IRC. Return to startup screen!')
            location.hash = '/'
            return
        }

        var ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')

        ws.onopen = e => {
            ws.send(`PASS oauth:${token}`)
            console.log(`< PASS oauth:${token}`)

            ws.send(`NICK ${nick}`)
            console.log(`< NICK ${nick}`)

            ws.send(`JOIN #nguyenntt`)
            console.log(`< JOIN #nguyenntt`)
        }

        ws.onmessage = e => {
            console.log(`> ${e.data}`)
            if (!connected && e.data.includes('tmi.twitch.tv')) {
                setConnected(true)
            }

            if (e.data.includes('PING')) {
                let text = e.data.replace('PING', 'PONG')
                console.log(`< ${text}`)
                ws.send(text)
            }

            const term = 'PRIVMSG #nguyenntt :?'
            if (e.data.includes(term)) {
                let start = e.data.indexOf(term) + term.length - 1
                var cmd = e.data.substring(start, e.data.length - 1).trim()
                setChatCmd(cmd)
            }
        }

        ws.onerror = e => {
            showNotiErr(`> Error: ${e}`)
        }

        setIrcWS(ws)
        fetchApi('https://apg-api-g2.herokuapp.com/user/scores')
            .then(rs => {
                setRankScore(rs)
            })
            .catch(err => console.log(err))

        setUserScore(props.profile['score'])

        return () => {
            setConnected(false)
            ws.close()
        }
    }, [props.profile.token])

    useEffect(() => {
        if (connected) {
            showNotiErr('Control linked to server')
        }
    }, [connected])

    useEffect(() => {
        fetchApi('https://apg-api-g2.herokuapp.com/round/player')
            .then(rs => {
                if (rs['username'] == props.profile['username']) {
                    setBePlayer(true)
                }
            }).catch(err => {
                console.log(`Check cur player failed ${err.text}`)
            })
    }, [props.profile])

    useEffect(() => {
        if (!chatCmd) return
        if (chatCmd.includes('?elect')) {
            let who = chatCmd.split(' ')[1]

            if (who == props.profile['username']) {
                setBePlayer(true)
            } else {
                let winScore = 0
                if (gameScore[0] > gameScore[1]) {
                    winScore += pmBet * 2
                } else if (gameScore[0] < gameScore[1]) {
                    winScore += ghostBet * 2
                } else {
                    winScore += pmBet * 1.5 + ghostBet * 1.5
                }

                setPmBet(0)
                setGhostBet(0)

                setUserScore(s => {
                    let newScore = s + 200 + winScore

                    fetch('https://apg-api-g2.herokuapp.com/user/score',
                        {
                            'method': 'POST',
                            headers: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            'body': `state=${props.profile.user_id}&score=${newScore}`
                        })
                        .then(rs => rs.text())
                        .then(rs => console.log('Status of update', rs))
                        .catch(err => console.log(err))

                    return newScore
                })
                setBePlayer(false)
            }
            fetchApi('https://apg-api-g2.herokuapp.com/user/scores')
                .then(rs => {
                    setRankScore(rs)
                })
                .catch(err => console.log(err))

            setChatCmd(null)
        }
    }, [chatCmd, props.profile.username, props.profile.user_id, gameScore, pmBet, ghostBet])

    const onKeyCommand = (cmd) => {
        let now = Date.now()
        if ((now - lastPress) > 1500) {
            setLastPress(now);
            if (ircWS.readyState === WebSocket.OPEN) {
                ircWS.send(`PRIVMSG #nguyenntt :${cmd}`)
                console.log(`< PRIVMSG #nguyenntt :${cmd}`)
            }
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
        let myStorage = window.localStorage;
        const lastTime = myStorage.getItem('lastTime') === 'true'

        let special = '!'
        if (lastTime) {
            special = "~"
        }

        console.log("Last time is", lastTime, !lastTime)
        myStorage.setItem('lastTime', !lastTime)
    
        if (pressedUp) {
            onKeyCommand(special + "goUp")
            setPressUp(false);
        }
        if (pressedDown) {
            onKeyCommand(special + "goDown")
            setPressDown(false);
        }
        if (pressedLeft) {
            onKeyCommand(special + "goLeft")
            setPressLeft(false);
        }
        if (pressedRight) {
            onKeyCommand(special + "goRight")
            setPressRight(false);
        }
    }

    useEffect(() => {
        if (!connected) {
            return;
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [connected, handleKeyDown, handleKeyUp])

    console.log('connected not', connected)
    return [
        <div key={0} id="snackbar" className={`${(errMsg.length !== 0) ? "show-bar" : ""}`}>{errMsg}</div>,
        <div className="control-panel">
            <ScoreBoard score={userScore} onGameScoreUpdate={setGameScore} profile={props.profile} />
            {isPlayer ?
                (<div key={1} className="control-board">
                    <div key={1}>
                        <span className={`material-icons ${pressedUp || !connected ? "pressed" : ""}`}>
                            W
                        </span>
                    </div>
                    <div key={2}>
                        <span key={1} className={`material-icons ${pressedLeft || !connected ? "pressed" : ""}`}>
                            A
                        </span>
                        <span key={3} className={`material-icons ${pressedRight || !connected ? "pressed" : ""}`}>
                            D
                        </span>
                    </div>
                    <div key={3}>
                        <span key={2} className={`material-icons ${pressedDown || !connected ? "pressed" : ""}`}>
                            S
                        </span>
                    </div>
                </div>) : (
                    <div key={1} className="bet-board">
                        <h3>WHO WILL WIN?</h3>
                        <div key={2}>
                            <span key={1} onClick={() => {
                                if (userScore > 0) {
                                    setPmBet(bet => bet += 10)
                                    setUserScore(s => s -= 10)
                                }
                            }}>
                                Bet Pacman<br />({pmBet})
                            </span>
                            <span key={2} onClick={() => {
                                if (userScore > 0) {
                                    setGhostBet(bet => bet += 10)
                                    setUserScore(s => s -= 10)
                                }
                            }}>
                                Bet Ghost<br />({ghostBet})
                            </span>
                        </div>
                    </div>
                )}

            <RankingBoard rankScore={rankScore} userScore={userScore} />
        </div>,
    ]
}