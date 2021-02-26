import React from 'react';
import { useState, useRef } from 'react';
import { socket } from './App.js';
export function Login ({symbol, onClick}){
    const sId = socket.id;
    //console.log("Sid: " + sId);
    const inputRef = useRef(null); // Reference to <input> element
    const [player_lst, addPlayer] = useState([]); //array of { sId: socket.id, username : username }
    
    function inputUsername(){
        if (inputRef != null) {
            
            const username = inputRef.current.value;
            addPlayer(prevPlayers => [...prevPlayers, {sId : socket.id, username : username}]);
            //console.log(l);
            socket.emit('player_joined', { sid: socket.id, username : username });
        }
    }
    
    socket.on('player_joined', (data) => {//{ sid: socket.id, username : username, num_players: num_players }
        if(data != undefined){
            console.log(data);
            console.log(player_lst.length);
            addPlayer(prevPlayer => [...prevPlayer, {sId : data.sid, username : data.username}]);
        }
    });
    //socket.on('connect', (data) => {
        //console.log(data);
        
        //console.log(socket);
        // if(data != undefined){
        //     if(data.length == 2){
        //         setPlayer(prevPlayer => {
        //             return {...prevPlayer, X: data[0], O: data[1]}
        //         });
        //         changeTurn(prevTurn => {
        //             return {...prevTurn, turn: data[0]} //setting first player id for X turn
        //         });
        //     }
        // }
    //});
    
    return (
        <div className="form-group row">
            
            <div className="form-row mx-auto">
                <div className="col-xs-4 center">
                    <input type="text" ref={inputRef} className="form-control" placeholder="Enter Username"/>
                </div>
                <div className="input-group-append center">
                    <button className="btn btn-primary mb-4" onClick={inputUsername}>Log in</button>
                </div>
            </div> 
        </div>
    );
}
