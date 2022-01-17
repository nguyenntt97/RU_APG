import React, { useEffect } from 'react'
import './RankingBoard.css'

export default function RankingBoard(props) {
    var scores = props.rankScore;
    console.log('score before', scores)

    useEffect(() => {
        if (props.rankScore != null && props.profile != null && props.profile.username != null) {
            let curUser = scores.find(x => x[0] == props.profile.username)
            console.log('Profile check', props.rankScore, "_",props.profile.username, "_", curUser)

            if (curUser == null) {
                window.location.reload();
            }
        }
    }, [props.profile, props.rankScore])

    if (scores) {
        scores.sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
    }
    console.log('score after', scores)
    return (
        <ul className='ranking-board'>
            <h3>RANKING</h3>
            {props.rankScore ? scores.map((i, d) =>
                <li key={i}>
                    <span>{d + 1}&nbsp;<b>{i[0]}</b></span>{i[1]}
                </li>
            ) : ''}
            <li>...</li>
            <li key={'user-i'}>
                <span>{props.userScore}</span>You
            </li>
        </ul>
    )
}