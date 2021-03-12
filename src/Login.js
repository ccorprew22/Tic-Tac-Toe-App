// import React from 'react';
import { useRef, useState } from 'react';
import { socket } from './App';
export function Login() {
  const inputRef = useRef(null); // Reference to <input> element
  // const [player_lst, addPlayer] = useState([]); //array of { sId: socket.id, username : username }
  const [error, setError] = useState('');
  function inputUsername() {
    if (inputRef !== null) {
      const username = inputRef.current.value;
      if(username.length === 0){
        setError(prevError => prevError = <p className="error center">Input Box Cannot Be Empty</p>);
      }else{
        socket.emit('remove_login', { sid: socket.id });
        socket.emit('player_joined', { sid: socket.id, username: username });
      }
    }
  }

  return (
    <div>
      <div className="form-group row">
        <div className="form-row mx-auto">
          <div className="col-xs-4 center">
            <input
              aria-label="username"
              type="text"
              ref={inputRef}
              className="form-control"
              placeholder="Enter Username"
            />
          </div>
          <div className="input-group-append center">
            <button className="btn btn-primary mb-4" onClick={inputUsername}>
              Login
            </button>
          </div>
        </div>
        
      </div>
      {error}
    </div>
  );
}
