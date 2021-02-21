import React from 'react';
import { useState, useRef } from 'react';

export function Signup ({symbol, onClick}){
    return (
        <form className="form-group row">
            <div className="form-row mx-auto">
                <div className="col-xs-4 center">
                    <input type="text" class="form-control" placeholder="Sign Up" name="username"/>
                </div>
                <div className="input-group-append center">
                    <button type="submit" class="btn btn-primary mb-4" name="username_signup" >Sign up</button>
                </div>
            </div> 
        </form>
    );
}
