import React from 'react';
import { useState, useRef } from 'react';

export function Signup ({symbol, onClick}){
    return (
        <form>
            <div class="form-row">
                <div class="col">
                    <label for="inputUsername">Create New Username</label>
                    <input type="text" class="form-control" placeholder="Username" name="username"/>
                    <button type="submit" class="btn btn-primary" name="username_signup">Sign up</button>
                </div>
            </div> 
        </form>
    );
}
