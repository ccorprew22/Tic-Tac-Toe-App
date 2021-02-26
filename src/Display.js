import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { socket } from './App.js';

export function Display(player){
    const sId = socket.id;
    //console.log(socket.id);
    const [playerX, setX] = useState('X');
    const [playerO, setO] = useState('O');
    const [result, setResult] = useState("");
    const [player_lst, addPlayer] = useState([]); //array of { sId: socket.id, username : username }
    //var display;
    var display = <h1 className="text-center">X: {playerX} vs O: {playerO}</h1>;
    var player_user;
    
    socket.off('player_joined').on('player_joined', (data) => {//{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
        if(data != undefined){
            console.log(data);
            console.log(socket.id);
            addPlayer(prevPlayer => [...prevPlayer, {sId : data.sid, username : data.username}]);
            setX(prevX => prevX = data.players[0]);
            setO(prevO => prevO = data.players[1]);
        }
    });
    
    socket.on('game_over' , (data) => { //{winner: winner, X: two_player.X, O: two_player.O, champ: sId, champ_user = [{sid: sid, user: username}]}
        console.log(data);
        if(data.winner == true){ //adjust to send winning player
            var winner;
            //console.log(winner);
            if(data.champ == data.X){
                winner = playerX;
            }else{
                winner = playerO;
            }
            setResult(prevResult => prevResult = "Winner: " + winner); //Game over
        }else{
            setResult(prevResult => prevResult = "Draw"); //Draw
        }
    });

    if(result.length > 0){
        display = <h1 className="text-center">{result}</h1>;
    }
    return (
        <div>
            {display}
        </div>
    
    );
}
