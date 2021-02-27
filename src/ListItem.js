import React from 'react';
import { socket } from './App.js';
export function ListItem({name}){
    return (
    <li className="list-group-item">{ name }</li>
    );
}
