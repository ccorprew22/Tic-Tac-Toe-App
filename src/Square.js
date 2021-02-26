import React from 'react';
import { useState, useRef } from 'react';

export function Square ({symbol, onClick}){
    return (
        <div className="box" onClick={onClick}>
            <p className="text-center symbol-margin">{symbol}</p>
        </div>
    );
}
