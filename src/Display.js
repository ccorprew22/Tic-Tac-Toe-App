import React from 'react';
import { socket } from './App.js';
import { useState, useRef, useEffect } from 'react';


export function Display(){
    
    const [playerX, setX] = useState('X');
    const [playerO, setO] = useState('O');
    const [result, setResult] = useState("");
    //var display;
    socket.on('connect', (data) => {
        
        if(data != undefined && data.length>=2){
            setX(prevX => prevX = data[0]);
            setO(prevO => prevO = data[1]);
        }
    });
    
    var display = <h1 className="text-center">{playerX} vs {playerO}</h1>;
    
    socket.on('game_over' , (data) => {
        console.log(data);
        if(data.winner == true){ //adjust to send winning player
            setResult(prevResult => prevResult = "Winner: " + data.champ); //Game over
        }else{
            setResult(prevResult => prevResult = "Draw"); //Draw
        }
    });
    // useEffect(() => {
        
    // }, [display]);
    if(result.length > 0){
        display = <h1 className="text-center">{result}</h1>;
    }
    return (
        <div>
            {display}
        </div>
    
    );
}
