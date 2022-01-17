import React from 'react'
import './RankingBoard.css'

export default function RankingBoard(props) {
    console.log('Ranki-board', props.rankScore)
    return (
        <ul className='ranking-board'>
            <h3>RANKING</h3>
            {props.rankScore ? props.rankScore.map((i, d) =>
                <li key={i}>
                    <span>{d+1}&nbsp;<b>{i[0]}</b></span>{i[1]}
                </li>
            ) : ''}
            <li>...</li>
            <li key={'user-i'}>
                <span>{props.userScore}</span>You
            </li>
        </ul>
    )
}