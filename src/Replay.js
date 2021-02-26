import React from 'react';
import { socket } from './App.js';

export function Replay(){

    function replayRequest(){
        socket.emit("replay", {sid : socket.id});
    }
    

    return (
        <button className="btn btn-primary mb-4" onClick={replayRequest}>Replay</button>
    );
}
