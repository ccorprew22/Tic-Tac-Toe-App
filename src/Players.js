import React from 'react';
import { ListItem } from './ListItem.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import {socket} from './App.js'

export function Players (player){ //Online players list
    const [player_lst, addPlayer] = useState([]);
    const [two_player, setPlayer] = useState();
    
    socket.on('player_joined', (data) => {//{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, username: username}] }
        if(data != undefined){
            //console.log(data);
            //console.log(player_lst.length);
            addPlayer(prevPlayer => prevPlayer = data.players); //playerlst
            setPlayer(prevPlayer => prevPlayer = data.two_players); //two players
        }
    });
    socket.on('disconnect', (data) => { //{'player_lst': player_lst, 'player_left': request.sid}
        if(data != undefined){
            var test_lst = [];
            for(var i = 0; i<data.player_lst.length; i++){
                if(data.player_lst[i] !== ""){
                    test_lst.push(data.player_lst[i]);
                }
            }
            console.log(test_lst)
            addPlayer(player => player = test_lst);
            
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

