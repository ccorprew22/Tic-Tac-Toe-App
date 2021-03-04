import React from 'react';
import { socket } from './App.js';
export function Username({username, score, userLogged, index}){
    var style = "white";
    if(userLogged === username){
        style = "yellow";
    }
    
    return (
        <tr>
            <th className={style} scope="row">{index}</th>
            <td className={style}>{username}</td>
            <td className={style}>{score}</td>
        </tr>
    );
}
