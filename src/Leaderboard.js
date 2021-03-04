import React from 'react';
//import { ListItem } from './ListItem.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import {socket} from './App.js';

export function Leaderboard(player){
    const [leaderboard, setLeader] = useState([]);
    socket.on('player_joined', (data) => {//{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, user: user}], display_lst : display_lst, leaderboard : [{username: username, score: score}]}
            //console.log(data);
            //console.log(player_lst.length);
            setLeader(prevLeader => prevLeader = data.leaderboard); //leaderboard
    });
    return(
        <div className="card">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Username</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                {leaderboard.map((player, index) =>
                    <tr>
                        <th scope="row">{index+1}</th>
                        <td>{player.username}</td>
                        <td>{player.score}</td>
                    </tr>
                )}
            </table>
        
        </div>
    );
}