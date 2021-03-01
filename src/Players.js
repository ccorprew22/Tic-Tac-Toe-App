import React from 'react';
import { ListItem } from './ListItem.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import {socket} from './App.js'

export function Players (player){ //Online players list
    const [player_lst, addPlayer] = useState([]);
    const [two_player, setPlayer] = useState();
    
    socket.on('player_joined', (data) => {//{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, username: username}], display_lst: display_lst }
        if(data != undefined){
            //console.log(data);
            //console.log(player_lst.length);
            addPlayer(prevPlayer => prevPlayer = data.display_lst); //playerlst
            setPlayer(prevPlayer => prevPlayer = data.two_players); //two players
        }
    });
    socket.on('disconnect', (data) => { //{'player_lst': overall_lst, 'player_left': request.sid, 'display_lst' : display_lst}
        if(data != undefined){
            addPlayer(player => player = data.display_lst);
        }
    });

    return (
        <div className="card">
            <div className="card-header">
                Player Lobby
            </div>
            <ul className="list-group list-group-flush">
                {player_lst.map((player, index) => 
                    <ListItem name={player.username} key={index}/>
                )}
            </ul>
        </div>

    );
}

