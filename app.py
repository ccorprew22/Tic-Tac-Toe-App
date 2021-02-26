import os
from flask import Flask, send_from_directory, json, session, request
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

global i
i = 1
global player_lst
player_lst = ["Waiting for player", "Waiting for player"]
global num_players
num_players = 0
global two_player
two_player = ["", ""]
global sid_lst
sid_lst = []
global replay_lst
replay_lst = []

@app.route('/', defaults={"filename": "index.html"})
#@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    global i
    sid = request.sid #socket id
    print("User " + str(i) + " connected!")
    socketio.emit('connect', player_lst, broadcast=True, include_self=True)
    i += 1

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    global player_lst
    #send data on disconnect to remove player from list 
    print('User disconnected!')

#Removes log in div
@socketio.on('remove_login')
def on_remove_login(data):
    socketio.emit("remove_login", data, broadcast=True, include_self=True)

#When player logs in with username
@socketio.on('player_joined') #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
def on_player_joined(data):
    global num_players
    global two_player
    global player_lst
    if player_lst[0] == "Waiting for player": #did this for display.js after removing login
        player_lst[0] = data['username']
    elif player_lst[1] == "Waiting for player":
        player_lst[1] = data['username']
    else: #after first two players are found
        player_lst.append(data['username'])
    print(player_lst)
    num_players += 1
    data['num_players'] = num_players
    if two_player[0] == "":
        two_player[0] = data['sid']
    elif two_player[1] == "":
        two_player[1] = data['sid'] 
    data['two_players'] = two_player #Player list
    data['players'] = player_lst #Overall user list
    print(data)
    socketio.emit('player_joined', data, broadcast=True, include_self=True)
 
# 'choice' is a custom event name that we just decided
@socketio.on('choice')
def on_choice(data): # data is whatever arg you pass in your emit call on client
    socketio.emit('choice', data, broadcast=True, include_self=False)

 #When player makes turn change
@socketio.on('turn')
def on_turn(data):
    print(str(data))
    socketio.emit('turn', data, broadcast=True, include_self=True)
   
@socketio.on('game_over')
def on_game_over(data):
    champ_user = [{'sid' : data['X'], 'user' : two_player[0]}, {'sid' : data['O'], 'user': two_player[1]}]
    data["champ_user"] = champ_user
    socketio.emit('game_over', data, broadcast=True, include_self=True)

#Replay
@socketio.on("replay")
def on_replay(data): #socket.id
    global replay_lst
    if data['sid'] == two_player[0] and data['sid'] not in replay_lst:
        replay_lst.append(data['sid'])
    elif data['sid'] == two_player[1] and data['sid'] not in replay_lst:
        replay_lst.append(data['sid'])
    
    if len(replay_lst) == 2:
        data = [True, len(replay_lst)]
        replay_lst = []
    socketio.emit("replay", data, broadcast=True, include_self=True)

if __name__ == '__main__':
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=False,
        use_reloader=False
    )
