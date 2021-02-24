import React from 'react';
import { Square } from './Square.js'
import { useState, useRef, useEffect } from 'react';
//import io from 'socket.io-client';
//import { onClickSymbol } from './App.js';
import { socket } from './App.js';
//const socket = io();
export function Board (){
    const inputRef = useRef(null);
    var winner = null;
    const [two_player, setPlayer] = useState({X: -1, O: -1});
    const [turns, changeTurn] = useState({turn: 0});
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
                if(board[a].symbol != "" || board[b].symbol != "" || board[c].symbol != "") //So that it won't count three consecutive blanks as a game over
                    return true;
            }
        }
        return false;
    }
    
    function onClickSymbol(squareId, symbol){
        var data_board = board;
        if (inputRef != null){
            console.log(squareId);
            var symb = "";
            if(symbol == "X" ){
                symb = "O";
            }else if(symbol == "O" || symbol == ""){
                symb = "X";
            }
            var i = 0;
            setBoard(board.map((square) => square.id == squareId ? {...square, symbol: symb} : square));
            var _check_ = check(board, squareId, symb);
            console.log(_check_);
            if(_check_ == true){
                winner = true;
                console.log("Game over");
            }//Add check for if board is full
            data_board.map((square) => square.id == squareId ? square.symbol = symb : square);
            socket.emit('choice', {board: data_board, winner: winner}); // emits event, sending entire board and winner
            console.log({squareId: squareId, symb: symb, winner: winner })
            if(winner == true){
                console.log("You win!");
            }
        }
    }
 
  useEffect(() => {
    socket.on('connect', (data) => {
        if(data != undefined && data[0].length % 2 == 0 && two_player.O == -1){
            console.log(data[0]);
            console.log(data[1]);
            if(data[0][1] == data[1] && two_player.X == -1){
                setPlayer(prevPlayer => {
                    return {X : data[1], O : -1};
                });
                //two_player.X = data[0][1];
            }else if(data[0][3] == data[1] && two_player.X != -1 && data[1] > two_player.X){
                setPlayer(prevPlayer => {
                    return { X: data[0][1], O : data[0][3]};
                });
            }
        }
        console.log(two_player);
        //Find out how to do session variable
    });
    
    socket.on('choice', (data) => { //responds when 'choice' is emitted
      //console.log('Choice event received!');
      console.log(data);
      var new_board = data.board;
      console.log(new_board[0].symbol);
      var i = 0;
      setBoard(board.map((square) => {
          if(square.id == new_board[i].id){
              return {...square, symbol: new_board[i++].symbol};
          }else{
              i++;
          }
      }));
      /*
      changeTurn(prevTurn => {
        if(turns.turn == 0){
            return { turn : 1 };
        }else{
            return { turn : 0 };
        }
      });
      */
      if(data.winner == true){
          console.log("You lost");
      }
    });
  }, [board]); //put board so that it will save the changes and not reset the board after choice
  console.log(two_player);
    return (
        <div className="board">
                {board.map((square, index) =>
                    //<div className="box" onClick={() => onClickSymbol(square.id)}>{square.symbol}</div>
                    <Square key={index} symbol={square.symbol} onClick={() => onClickSymbol(square.id, square.symbol)}/>
                )}
        </div>
    );
}