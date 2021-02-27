import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { socket } from './App.js';
import { Replay } from './Replay.js';

export function Display(player){
    //const sId = socket.id;
    //console.log(socket.id);
    const [playerX, setX] = useState('X');
    const [playerO, setO] = useState('O');
    const [result, setResult] = useState("");
    //const [player_lst, addPlayer] = useState([]); //array of { sId: socket.id, username : username }
    //var display;
    var display = <h1 className="text-center display">X: {playerX} vs O: {playerO}</h1>;
    
    socket.on('player_joined', (data) => {//{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, username :user}] }
        if(data != undefined){
            //console.log(data);
            //console.log(socket.id);
            //addPlayer(prevPlayer => [...prevPlayer, {sId : data.sid, username : data.username}]);
            if(data.late_join == false){
                for(var i = 0; i<data.players.length; i++){ //Attempting to fill in page for late players after a disconnect
                    if(data.two_players[0] != "Disconnected Player" && data.players[i].sid == data.two_players[0]){
                        setX(prevX => prevX = [data.players[i].sid , data.players[i].username]);
                        setResult(prevResult => prevResult = "Player Disconnect! Game Over"); 
                        break;
                    }else if(data.two_players[1] != "Disconnected Player" && data.players[i].sid == data.two_players[1]){
                        setO(prevO => prevO = [data.players[i].sid , data.players[i].username]);
                        setResult(prevResult => prevResult = "Player Disconnect! Game Over");
                        break;
                    }else{
                        setResult(prevResult => prevResult = "Player Disconnect! Game Over");
                        break;
                    }
                }
            }else if(playerX == 'X' && data.players.length == 1){
                setX(prevX => prevX = [data.players[0].sid , data.players[0].username]);
            }else if(playerO == 'O' && data.players.length >= 2){
                setX(prevX => prevX = [data.players[0].sid , data.players[0].username]);
                setO(prevO => prevO = [data.players[1].sid , data.players[1].username]);
            }
            //setX(prevX => prevX = [data.sid , data.players[0].username]);
            //setO(prevO => prevO = [data.sid , data.players[1].username]);
        }
    });
    
    socket.on('disconnect', (data) => { //{'player_lst': player_lst, 'player_left': request.sid}
        if(data != undefined){
            if(data.player_left == playerX[0]){ //Attempting to blame specific player FIX!
                setResult(prevResult => prevResult = "Player Disconnect! Game Over"); //Game over due to X disconnect)
                setX(prevX => prevX = 'X');
            }else if(data.player_left == playerO[0]){
                setResult(prevResult => prevResult = "Player Disconnect! Game Over"); //Game over due to O disconnect)
                setX(prevX => prevX = 'O');
                console.log("O left");
            }
        }
    });
    
    socket.on('game_over' , (data) => { //{winner: winner, X: two_player.X, O: two_player.O, champ: sId, champ_user = [{sid: sid, user: username}]}
        //console.log(data);
        if(data.winner == true){ //adjust to send winning player
            var winner;
            //console.log(winner);
            if(data.champ == data.X){
                winner = playerX;
            }else{
                winner = playerO;
            }
            setResult(prevResult => prevResult = "Winner : " + winner); //Game over
        }else{
            setResult(prevResult => prevResult = "Draw"); //Draw
        }
    });
    
    socket.on('replay', (data) => {//[True, len(replay_lst), two_player, overall_lst = {sid: sid, username: user}]
        if(data != undefined){
            if(data[0] == true && data[1] == 1){
                setResult(prevResult => prevResult = "");
                setX(prevX => prevX = [data[2][0] , data[3][0].username]);
                setO(prevO => prevO = [data[2][1] , data[3][1].username]);
                //display = <h1 className="text-center">X: {playerX} vs O: {playerO}</h1>
            }else if(data[0] == true && data[1] == 2){
                setResult(prevResult => prevResult = "");
                var x_index = -1;
                var y_index = -1;
                for(var i = 0; i<data[3].length; i++){
                    if(data[2][0] == data[3][i].sid){ //get x player username index
                        x_index = i;
                    }else if(data[2][1] == data[3][i].sid){ //get y player username index
                        y_index = i;
                    }
                    
                    if(x_index != -1 && y_index != -1){
                        break;
                    }
                }
                setX(prevX => prevX = [data[2][0] , data[3][x_index].username]);
                setO(prevO => prevO = [data[2][1] , data[3][y_index].username]);
            }
        } 
    });
    
    if(result == "Player Disconnect! Game Over"){
        display = <div className=""><h1 className="text-center display">{result}</h1><Replay className="text-center" key={11} name="New Player Game"/></div>;
    }else if(result.length > 0){
        display = <div className=""><h1 className="text-center display">{result}</h1><Replay className="text-center" key={11} name="Rematch"/></div>;
    }else if(result.length == 0){
        //socket.emit("restart")
        display = <h1 className="text-center display">X: {playerX[1]} vs O: {playerO[1]}</h1>;
    }
    return (
        <div className="mx-auto">
            {display}
        </div>
    
    );
}
