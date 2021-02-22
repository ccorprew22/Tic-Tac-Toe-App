import React from 'react';
import { useState, useRef } from 'react';

export function Login ({symbol, onClick}){
    return (
        <form className="form-group row">
            
            <div className="form-row mx-auto">
                <div className="col-xs-4 center">
                    <input type="text" className="form-control" placeholder="Enter Username" name="username"/>
                </div>
                <div className="input-group-append center">
                    <button type="submit" className="btn btn-primary mb-4" name="username_enter">Sign in</button>
                </div>
            </div> 
        </form>
    );
}
