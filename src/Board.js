import React from 'react';
import { Square } from './Square.js'
import { useState, useRef, useEffect } from 'react';
//import io from 'socket.io-client';
//import { onClickSymbol } from './App.js';
import { socket } from './App.js';


export function Board (){
    
    const sId = socket.id;
    const inputRef = useRef(null);
    var winner = null;
    const [two_player, setPlayer] = useState({X: "", O: ""});
    const X = two_player.X;
    const O = two_player.O;
    //const [playerId, setId] = useState(0);//Dont send in socket
    const [turns, changeTurn] = useState({turn: ""});
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
        console.log(socket);
        var data_board = board;
        var curr_turn = turns.turn;
        console.log("Player ID: " + sId);
        console.log("Current Turn: " + curr_turn);
        if (inputRef != null && symbol == ""){//Check to see if square is taken
            console.log(squareId);
            var symb = "";
            if(curr_turn == sId){
                if(two_player.X == sId){
                    symb = "X";
                    console.log("X MOVED");
                    changeTurn(prevTurn => {
                        return {...prevTurn, turn: two_player.O}
                    });
                    socket.emit('turn', {turn: two_player.O});
                }else if(two_player.O == sId){
                    symb = "O";
                    console.log("O MOVED");
                    changeTurn(prevTurn => { //EMIT CHANGE TO OTHERS
                        return {...prevTurn, turn: two_player.X}
                    });
                    socket.emit('turn', {turn: two_player.X});
                }
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
    socket.on('connect', (data) => {
        console.log(data);
        //console.log(socket);
        
        if(data != undefined){
            if(data.length == 2){
                setPlayer(prevPlayer => {
                    return {...prevPlayer, X: data[0], O: data[1]}
                });
                changeTurn(prevTurn => {
                    return {...prevTurn, turn: data[0]}
                });
            }
            
        }
    });
    
    socket.on('turn', (data) => {
        console.log(data);
        if(data != undefined){
            changeTurn(prevTurn => {
                return {...prevTurn, turn: data.turn}
            });
        }
    });
  useEffect(() => {
    
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
            <p>{sId}</p>
            
            
    </div>
    );
}