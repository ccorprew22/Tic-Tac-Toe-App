import React from 'react';
import { ListItem } from './ListItem.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import {socket} from './App.js'

export function Players (player){ //Online players list
    const [player_lst, addPlayer] = useState([]);
    
    socket.on('player_joined', (data) => {//{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
        if(data != undefined){
            //console.log(data);
            //console.log(player_lst.length);
            addPlayer(prevPlayer => prevPlayer = data.players);
        }
    });
    
    return (
        <div className="card">
            <div className="card-header">
                Player Lobby
            </div>
            <ul className="list-group list-group-flush">
                {player_lst.map((name, index) =>
                    <ListItem name={name} key={index} title={index}/>
                )}
            </ul>
        </div>

    );
}

