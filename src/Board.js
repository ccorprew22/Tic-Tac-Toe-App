import React from 'react';
import { Square } from './Square.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export function Board (symbol){
    const inputRef = useRef(null);
    var winner = null;
    var two_player = {'X': -1, 'O': -1};
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
                                        
    function check(old_board, squareId, symbol){
        const lines = [
                        [0, 1, 2],//top horizontal
                        [3, 4, 5],//mid horizontal
                        [6, 7, 8],//bottom horizontal
                        [0, 3, 6],//left vert
                        [1, 4, 7],//mid vert
                        [2, 5, 8],//right vert
                        [0, 4, 8],//left diagonal
                        [2, 4, 6],//right diagonal
                      ];
        var board = old_board;
        board[squareId] = {id: squareId, symbol: symbol};
        console.log(board);
        for(var i=0; i<lines.length; i++){
            var a = lines[i][0];
            var b = lines[i][1];
            var c = lines[i][2];
            if(board[a].symbol == board[b].symbol && board[a].symbol == board[c].symbol){
                if(board[0].symbol != "") //So that it won't count three consecutive blanks as a game over
                    return true;
            }
        }
        return false;
    }
    
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
             //TRY RUNNING OUTSIDE OF useEffect
            var _check_ = check(board, squareId, symb);
            console.log(_check_);
            if(_check_ == true){
                winner = true;
                console.log("Game over");
            }//Add check for if board is full
            socket.emit('choice', {squareId: squareId, symb: symb, winner:winner }); // emits event
            console.log({squareId: squareId, symb: symb, winner: winner })
            if(winner == true){
                console.log("You win!");
            }
        }
    }
 
  useEffect(() => {
    socket.on('connect', (data) => {
        console.log(data.list);
        //Find out how to do session variable
    });
    
    socket.on('choice', (data) => { //responds when 'choice' is emitted
      //console.log('Choice event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setBoard(board.map((square) => square.id == data.squareId ? {...square, symbol: data.symb} : square));
      if(data.winner == true){
          console.log("You lost");
      }
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
