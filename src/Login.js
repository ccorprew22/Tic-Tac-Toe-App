// import React from 'react';
import { useRef } from 'react';
import { socket } from './App';
export function Login() {
  const inputRef = useRef(null); // Reference to <input> element
  // const [player_lst, addPlayer] = useState([]); //array of { sId: socket.id, username : username }

  function inputUsername() {
    if (inputRef != null) {
      const username = inputRef.current.value;
      // addPlayer(prevPlayers => [...prevPlayers, {sId : socket.id, username : username}]);
      socket.emit('remove_login', { sid: socket.id });
      socket.emit('player_joined', { sid: socket.id, username: username });
    }
  }

  return (
    <div className="form-group row">
      <div className="form-row mx-auto">
        <div className="col-xs-4 center">
          <input
            type="text"
            ref={inputRef}
            className="form-control"
            placeholder="Enter Username"
          />
        </div>
        <div className="input-group-append center">
          <button className="btn btn-primary mb-4" onClick={inputUsername}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
