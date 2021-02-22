import React from 'react';
import { Square } from './Square.js'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export function Board (symbol){
    const inputRef = useRef(null);
    var winner = null;
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
        var board = old_board;
        board[squareId] = {id: squareId, symbol: symbol};
        console.log(board);
        if(board[0].symbol == board[3].symbol && board[0].symbol == board[6].symbol){//left vertical
            if(board[0].symbol != "") //So that it won't count three consecutive blanks as a game over
                return true;
        }else if(board[1].symbol == board[4].symbol && board[1].symbol == board[7].symbol){//mid vertical
            if(board[1].symbol != "")
                return true;
        }else if(board[2].symbol == board[5].symbol && board[2].symbol == board[8].symbol){//right vertical
            if(board[2].symbol != "")
                return true;
        }else if(board[0].symbol == board[1].symbol && board[0].symbol == board[2].symbol){//top horizontal
            if(board[0].symbol != "")
                return true;
        }else if(board[3].symbol == board[4].symbol && board[3].symbol == board[5].symbol){//mid horizontal
            if(board[3].symbol != "")
                return true;
        }else if(board[6].symbol == board[7].symbol && board[6].symbol == board[8].symbol){//bottom horizontal
            if(board[6].symbol != "")
                return true;
        }else if(board[0].symbol == board[4].symbol && board[0].symbol == board[8].symbol){//left diagonal
            if(board[0].symbol != "")
                return true;
        }else if(board[2].symbol == board[4].symbol && board[2].symbol == board[6].symbol){//right horizontal
            if(board[2].symbol != "")
                return true;
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
    
    //console.log(board);
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => { //Does changes that were done by other user
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
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
