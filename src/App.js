import logo from './logo.svg';
import './App.css';
//import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';
import { Players } from './Players.js';
import { Login } from './Login.js';
import { Signup } from './Signup.js';

const socket = io(); // Connects to socket connection

function App() {
  return (
    
    <div className="App">
      <h1 className="text-center">Tic Tac Toe</h1>
      <Login key={0}/>
      <Signup key={1}/>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-7 mb-3">
            <div className="card-deck">
              <div className="card no-border">
                <Board className="text-center" key={2}/>
              </div>
              <div className="card no-border">
                <Players key={3}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
export {socket};
