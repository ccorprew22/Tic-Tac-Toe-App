import React from 'react';
import { Square } from './Square.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export function Board (symbol){
    const inputRef = useRef(null);
    const [board, setBoard] = useState([
                                        {id: 0, symbol: ""},
                                        {id: 1, symbol: ""},
                                        {id: 2, symbol: ""},
                                        {id: 3, symbol: ""},
                                        {id: 4, symbol: ""},
                                        {id: 5, symbol: ""},
                                        {id: 6, symbol: ""},
                                        {id: 7, symbol: ""},
                                        {id: 8, symbol: ""},
                                        ]);

    function onClickSymbol(squareId, symbol){
        if (inputRef != null){
            console.log(squareId);
            var symb = "";
            if(symbol == "X" ){
                symb = "O";
            }else if(symbol == "O" || symbol == ""){
                symb = "X";
            }
            setBoard(board.map((square) => square.id == squareId ? {...square, symbol: symb} : square));
            socket.emit('choice', {squareId: squareId, symb: symb }); // emits event
        }

    }

    // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('choice', (data) => { //responds when 'choice' is emitted
      console.log('Choice event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setBoard(board.map((square) => square.id == data.squareId ? {...square, symbol: data.symb} : square));
    });
  }, [board]); //put board so that it will save the changes and not reset the board after choice

    return (
        <div className="board">
                {board.map((square, index) =>
                    //<div className="box" onClick={() => onClickSymbol(square.id)}>{square.symbol}</div>
                    <Square key={index} symbol={square.symbol} onClick={() => onClickSymbol(square.id, square.symbol)}/>
                )}
        </div>

    );
}
