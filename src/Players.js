import React from 'react';
import { ListItem } from './ListItem.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import {socket} from './App.js'

export function Players (player){ //Online players list
    const inputRef = useRef(null);
    const [players, setPlayer] = useState([]);

    function onClickPlayer(squareId, symbol){
        if (inputRef != null){
            console.log(squareId);
            var symb = "";
            if(symbol == "X" ){
                symb = "O";
            }else if(symbol == "O" || symbol == ""){
                symb = "X";
            }
            //setPlayer(board.map((square) => square.id == squareId ? {...square, symbol: symb} : square));
            //socket.emit('choice', {squareId: squareId, symb: symb }); // emits event
        }

    }

    return (
        <div className="card">
            <div className="card-header">
                Featured
            </div>
            <ul className="list-group list-group-flush">
                {players.map((name, id) =>
                    <ListItem name={player.name}/>
                )}
            </ul>
        </div>

    );
}

