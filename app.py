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
    manage_session=False,
    ping_interval = 1
)

global num_players
num_players = 0
global two_player
two_player = ["", ""]
global overall_lst
overall_lst = ["Waiting for player", "Waiting for player"] #{sid : socketio.id, username : user}
global replay_lst
replay_lst = []
global display_lst #Temporary solution for problem involving empty spots on player list after disconnect, current problem is handling changing list length
display_lst = []

@app.route('/', defaults={"filename": "index.html"})
#@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    sid = request.sid #socket id
    print("User connected! " + request.sid)
    #socketio.emit('connect', player_lst, broadcast=True, include_self=True)
    

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    global overall_lst
    global two_player
    global display_lst
    removed_user = ""
    for i in range(len(overall_lst)):
        if type(overall_lst[i]) is str:
            continue
        elif overall_lst[i]['sid'] == request.sid:
            removed_user = overall_lst[i]
            overall_lst[i] = "Disconnected Player"
            break
    if request.sid in two_player:
        index = two_player.index(request.sid)
        two_player[index] = "Disconnected Player"
    
    if removed_user in display_lst:
        display_lst.remove(removed_user)
    #send data on disconnect to remove player from list
    message = {'player_lst': overall_lst, 'player_left': request.sid, 'display_lst' : display_lst}
    print('User disconnected! : ' + request.sid)
    socketio.emit('disconnect', message, broadcast=True, include_self=True)
    
#Removes log in div
@socketio.on('remove_login')
def on_remove_login(data):
    socketio.emit("remove_login", data, broadcast=True, include_self=True)

#When player logs in with username
@socketio.on('player_joined') #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
def on_player_joined(data):
    global num_players
    global two_player
    global overall_lst
    global display_lst
    if overall_lst[0] == "Waiting for player": #did this for display.js after removing login
        overall_lst[0] = {'sid' : data['sid'], 'username' : data['username']}
    elif overall_lst[1] == "Waiting for player":
        overall_lst[1] = {'sid' : data['sid'], 'username' : data['username']}
    else: #after first two players are found
        overall_lst.append({'sid' : data['sid'], 'username' : data['username']})
    #print(player_lst)
    #overall_lst.append({'sid' : data['sid'], 'username' : data['username']})
    num_players += 1
    data['num_players'] = num_players
    if two_player[0] == "":
        two_player[0] = data['sid']
    elif two_player[1] == "":
        two_player[1] = data['sid'] 
    late_join = True #Game in session
    if "Disconnected Player" in two_player:
        late_join = False #Looking for new player
    display_lst.append({'sid' : data['sid'], 'username' : data['username']})
    data['two_players'] = two_player #Player list
    data['players'] = overall_lst #Overall list usernames {sid: sid, username: username}
    data['late_join'] = late_join
    data['display_lst'] = display_lst
    print(data)
    socketio.emit('player_joined', data, broadcast=True, include_self=True) #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, user: user}], display_lst : display_lst }
 
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
    
    if "Disconnected Player" in two_player: #to fill open spot
        if data['sid'] not in two_player:
            index = two_player.index("Disconnected Player")
            two_player[index] = data['sid']
            replay_lst.append(data['sid'])
    if data['sid'] in two_player and data['sid'] not in replay_lst:
        replay_lst.append(data['sid'])
    
    if len(replay_lst) == 2:
        data = [True, len(replay_lst), two_player, overall_lst]
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
