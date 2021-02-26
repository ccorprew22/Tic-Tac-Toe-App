import logo from './logo.svg';
import './App.css';
//import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';
import { Players } from './Players.js';
import { Login } from './Login.js';
import { Signup } from './Signup.js';
import { Display } from './Display.js';
const socket = io(); // Connects to socket connection

function App() {
  const [display, changeDisplay] = useState(<div><Login key={0}/><h1 className="text-center chalk-font">Welcome! Log in to join in on the action!</h1></div>);
  
  socket.off('remove_login').on('remove_login', (data) => {//{ sid: socket.id }
      if(data != undefined){
          console.log(data);
          console.log(socket.id);
          if(socket.id == data.sid){
            changeDisplay(prevDisplay => prevDisplay = <div><Display key={34}/>
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-7 mb-3">
          <div className="card-deck">
            <div className="card no-border">
              <Board className="text-center" key={3}/>
            </div>
            <div className="card no-border">
              <Players key={4}/>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>);
          }
      }
  });
  
  return (
    <div className="App">
      <h1 className="text-center title chalk-font">Tic Tac Toe</h1>
      {display}
    </div>
  );
}

export default App;
export {socket};