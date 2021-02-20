import logo from './logo.svg';
import './App.css';
//import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';

//const socket = io(); // Connects to socket connection

function App() {
  return (
    <div className="App">
      <Board key={0}/>
    </div>
  );
}

export default App;
