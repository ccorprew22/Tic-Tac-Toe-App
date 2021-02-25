import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { socket } from './App.js';

export function Display(){
    const sId = socket.id;
    //console.log(socket.id);
    const [playerX, setX] = useState('X');
    const [playerO, setO] = useState('O');
    const [result, setResult] = useState("");
    const [player_lst, addPlayer] = useState([]); //array of {sid: username}
    //var display;
    var display = <h1 className="text-center">{playerX} vs {playerO}</h1>;
    var player_user;
    socket.on('connect', (data) => {
        
        if(data != undefined && data.length>=2){
            setX(prevX => prevX = data[0]);
            setO(prevO => prevO = data[1]);
        }
    });
    
    socket.on('player_joined', (data) => {
        if(data != undefined){
            console.log(data);
            console.log(socket.id);
            addPlayer(prevPlayer => [...prevPlayer, {sId : data.sId, username : data.username}]);
            if(socket.id == data.sId) {
            	console.log('Thats you who joined');
            }else{
            	console.log("Not you");
            }
        }
    });
    
    socket.on('game_over' , (data) => {
        console.log(data);
        if(data.winner == true){ //adjust to send winning player
            setResult(prevResult => prevResult = "Winner: " + data.champ); //Game over
        }else{
            setResult(prevResult => prevResult = "Draw"); //Draw
        }
    });
    
    player_lst.map((player) => {
        if(playerX == player.sId){
            console.log("here in X");
            setX(prevX => prevX = "X: " + player.username);
        }else if(playerO == player.sId){
            setO(prevO => prevO = "O: " + player.username);
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
