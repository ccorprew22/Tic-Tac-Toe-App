import React from 'react';
import { socket } from './App.js';
export function ListItem({name, title}){

    if(title <= 1){ //player
        title = "Player";
    }else if(title >= 2){ //spectator
        title = "Spectator";
    }
    return (
    <li className="list-group-item">{title} : { name }</li>
    );
}
