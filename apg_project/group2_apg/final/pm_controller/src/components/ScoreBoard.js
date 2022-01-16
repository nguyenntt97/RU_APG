import React, { useEffect, useState } from 'react'
import { fetchApi } from '../util/Authentication/Utils'
import './ScoreBoard.css'

export default function ScoreBoard(props) {
    const [pacmanScore, setPacmanScore] = useState(0)
    const [ghostScore, setGhostScore] = useState(0)

    useEffect(() => {
        let scores = props.gameScore;
        setPacmanScore(scores[0])
        setGhostScore(scores[1])
    }, props.gameScore)

    useEffect(() => {
        const update_game_score = () => {
            fetchApi('https://apg-api-g2.herokuapp.com/score')
                .then(rs => {
                    let scores = rs['score'].split(' ')
                    setPacmanScore(scores[0])
                    setGhostScore(scores[1])
                    props.onGameScoreUpdate([score[0], score[1]])
                })
                .catch(err => {
                    console.log(`Score Error: ${err}`)
                })
        }
        update_game_score()
        // window.setInterval(update_game_score, 5000)
        return () => {
            console.log("Clear interval")
            // window.clearInterval(update_game_score)
        }
    }, [])

    return (
        <div className={'score-board'}>
            <h3>PACMAN {pacmanScore} - GHOST {ghostScore}</h3>
            <span>Your score: {props.score}</span>
        </div>
    )
}