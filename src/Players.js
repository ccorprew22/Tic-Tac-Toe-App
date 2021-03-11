// import React from 'react';
import { ListItem } from './ListItem';
import { useState } from 'react';
import { socket } from './App.js';

export function Players(player) {
  //Online players list
  const [player_lst, addPlayer] = useState([]);
  const [twoPlayer, setPlayer] = useState();

  socket.on('player_joined', (data) => {
    // { sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, username: username}], display_lst: display_lst }
    if (data !== undefined) {
      addPlayer((prevPlayer) => (prevPlayer = data.display_lst)); // playerlst
      setPlayer((prevPlayer) => (prevPlayer = data.two_players)); // two players
    }
  });
  socket.on('disconnect', (data) => {
    // {'player_lst': overall_lst, 'player_left': request.sid, 'display_lst' : display_lst}
    if (data !== undefined) {
      addPlayer((player) => (player = data.display_lst));
    }
  });

  return (
    <div className="card">
      <div className="card-header">Player Lobby</div>
      <ul className="list-group list-group-flush">
        {player_lst.map((player, index) => (
          <ListItem name={player.username} key={index} />
        ))}
      </ul>
    </div>
  );
}
