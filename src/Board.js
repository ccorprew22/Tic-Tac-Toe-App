import React from 'react';
import { Square } from './Square'
import { useState, useRef, useEffect } from 'react';
import { socket } from './App';

export function Board (){
    var winner = null;
    // console.log("Player ID: " + socket.id);
    const sId = socket.id;
    const inputRef = useRef(null);
    const [result, setResult] = useState(null);
    const [twoPlayer, setPlayer] = useState({X: '', O: ''});
    const X = twoPlayer.X;
    const O = twoPlayer.O;
    // const [player_lst, addPlayer] = useState([]); //array of { sId: socket.id, username : username }
    // const [playerId, setId] = useState(0);//Dont send in socket
    const [turns, changeTurn] = useState({turn: ''});
    // const [restart, setRestart] = useState("");
    const [board, setBoard] = useState([
                                        {id: 0, symbol: ''},
                                        {id: 1, symbol: ''},
                                        {id: 2, symbol: ''},
                                        {id: 3, symbol: ''},
                                        {id: 4, symbol: ''},
                                        {id: 5, symbol: ''},
                                        {id: 6, symbol: ''},
                                        {id: 7, symbol: ''},
                                        {id: 8, symbol: ''},
                                        ]);
                                      
    function check(oldBoard, squareId, symbol){
        const lines = [
                        [0, 1, 2],// top horizontal
                        [3, 4, 5],// mid horizontal
                        [6, 7, 8],// bottom horizontal
                        [0, 3, 6],// left vert
                        [1, 4, 7],// mid vert
                        [2, 5, 8],// right vert
                        [0, 4, 8],// left diagonal
                        [2, 4, 6],// right diagonal
                      ];
        var testBoard = oldBoard;
        testBoard[squareId] = {id: squareId, symbol: symbol};
        //  console.log(board);
        for(var i=0; i<lines.length; i++){
            var a = lines[i][0];
            var b = lines[i][1];
            var c = lines[i][2];
            if(testBoard[a].symbol === testBoard[b].symbol && testBoard[a].symbol === testBoard[c].symbol){
                if(testBoard[a].symbol !== '' || testBoard[b].symbol !== '' || testBoard[c].symbol !== '') //So that it won't count three consecutive blanks as a game over
                    return true;
            }
        }
        if(board.some(square => square.symbol === '')) { //Checks if board is full
            return null;
        }else{
            console.log('Draw');
            return false;
        }
    }
    function onClickSymbol(squareId, symbol){
        // console.log(socket);
        var dataBoard = board;
        var currTurn = turns.turn;
        // console.log("Player ID: " + sId);
        console.log('Current Turn: ' + currTurn);
        
        if (inputRef !== null && symbol === '' && result === null){//Check to see if square is taken
            console.log(squareId);
            var symb = '';
            console.log(turns);
            if(currTurn === sId){
                if(twoPlayer.X === sId){
                    symb = 'X';
                    console.log('X MOVED');
                    changeTurn(prevTurn => {
                        return {...prevTurn, turn: twoPlayer.O};
                    });
                    socket.emit('turn', {turn: twoPlayer.O});
                }else if(twoPlayer.O === sId){
                    symb = 'O';
                    console.log('O MOVED');
                    changeTurn(prevTurn => {
                        return {...prevTurn, turn: twoPlayer.X};
                    });
                    socket.emit('turn', {turn: twoPlayer.X});
                }
            }
            setBoard(board.map((square) => square.id === squareId ? {...square, symbol: symb} : square));
            var boardCheck = check(board, squareId, symb);
            console.log(boardCheck);
            if(boardCheck === true){
                winner = true;
                setResult(prevResult => prevResult = true);
                socket.emit('game_over', {winner: winner, X: twoPlayer.X, O: twoPlayer.O, champ: sId});
                console.log('Game over');
            }else if(boardCheck === false){//Draw if board is full
                winner = false;
                setResult(prevResult => prevResult = false);
                socket.emit('game_over', {winner: winner, X: twoPlayer.X, O: twoPlayer.O, champ: null});
                console.log('Game over');
            }
            dataBoard.map((square) => square.id === squareId ? square.symbol = symb : square); //board for emit
            socket.emit('choice', {board: dataBoard, winner: winner}); // emits event, sending entire board and winner
            
        }
    }
    // socket.off('MY_EVENT').on('MY_EVENT', () => doThisOnlyOnce());
    socket.off('turn').on('turn', (data) => {
        // console.log(data);
        if(data !== undefined){
            changeTurn(prevTurn => {
                return {...prevTurn, turn: data.turn}
            });
        }
    });
    
    socket.on('player_joined', (data) => { // { sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, user: user}] }
        // console.log("player joined")
        if(data !== undefined){
            // addPlayer(prevPlayer => [...prevPlayer, {sid : data.sid, username : data.username}]);
            if(data.num_players === 1){
                // console.log("X Player");
                setPlayer(prevPlayer => {
                    return {...prevPlayer, X: data.two_players[0]};
                });
            }else if(data.num_players === 2){
                // console.log("O Player");
                setPlayer(prevPlayer => {
                    return {...prevPlayer, X: data.two_players[0], O: data.two_players[1]};
                });
                changeTurn(prevTurn => { // setting first player id for X turn
                    return {...prevTurn, turn: data.two_players[0]};
                });
            }else if(data.num_players > 2){
                // console.log("spectator");
                // console.log("turn: " + turns.turn);
            }
             
            if(socket.id == data.sid) {
            	// console.log(data.username + ' joined');
            }else{
            	// console.log("Not you");
            }
        }
    });
    
    socket.on('replay', (data) => { // [True, len(replay_lst), two_player, , overall_lst]
        if(data !== undefined){
            // console.log(data);
            if(data[0] === true){
                setBoard(board.map((square) => square = {id: square.id, symbol : '' }));
                setResult(prevResult => prevResult = null);
                setPlayer(prevPlayers => prevPlayers = {X: data[2][0], O: data[2][1]});
                changeTurn(prevTurn => prevTurn = {turn: data[2][0]});
            }
        } 
    });

    useEffect(() => {
        socket.off('choice').on('choice', (data) => { // responds when 'choice' is emitted
          var newBoard = data.board;
          // console.log(new_board[0].symbol);
          var i = 0;
          setBoard(board.map((square) => {
              if(square.id === newBoard[i].id){
                  return {...square, symbol: newBoard[i++].symbol};
              }else{
                  i++;
              }
          }));
          if(data.winner !== null){
              setResult(prevResult => prevResult = data.winner);
          }
          if(data.winner === true){
              // console.log("You lost");
          }
    });
    
  }, [board]); // put board so that it will save the changes and not reset the board after choice
  
  // console.log(two_player);
    return (
    <div className="board">
        {board.map((square, index) =>
            // <div className="box" onClick={() => onClickSymbol(square.id)}>{square.symbol}</div>
            <Square key={index} symbol={square.symbol} onClick={() => onClickSymbol(square.id, square.symbol)}/>
        )}
    </div>
    );
}