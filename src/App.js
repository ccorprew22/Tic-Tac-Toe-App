import logo from './logo.svg';
import './App.css';
//import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
//import io from 'socket.io-client';
import { Board } from './Board.js';
import { Players } from './Players.js';
import { Login } from './Login.js';
import { Signup } from './Signup.js';

//const socket = io(); // Connects to socket connection

function App() {
  return (
    <div className="App">
      <h1 className="text-center">Tic Tac Toe</h1>
      <Login key={0}/>
      <Signup key={0}/>
      <div className="card-group">
        <div className="card">
          <Board key={0}/>
        </div>
        <div className="card">
          <Players key={0}/>
        </div>
      </div>
      
    </div>
  );
}

export default App;
