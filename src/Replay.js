import React from 'react';
import { socket } from './App.js';

export function Replay({name}){

    function replayRequest(){
        socket.emit("replay", {sid : socket.id});
    }
    

    return (
        <button className="btn mb-4 text-center" onClick={replayRequest}>{name}</button>
    );
}
