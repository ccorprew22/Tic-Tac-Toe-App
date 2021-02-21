import React from 'react';
import { useState, useRef } from 'react';

export function Login ({symbol, onClick}){
    return (
        <form>
            <div class="form-row">
                <div class="col">
                    <label for="inputUsername">Enter Username to Play!</label>
                    <input type="text" class="form-control" placeholder="Username" name="username"/>
                    <button type="submit" class="btn btn-primary" name="username_enter">Sign in</button>
                </div>
            </div> 
        </form>
    );
}
