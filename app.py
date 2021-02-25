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
player_lst = []

@app.route('/', defaults={"filename": "index.html"})
#@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    global i
    global player_lst
    sid = request.sid #socket id
    player_lst.append(sid)
    print(player_lst)
    print("User " + str(i) + " connected!")
    socketio.emit('connect', player_lst, broadcast=True, include_self=True)
    i += 1
    
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    global player_lst
    #send data on disconnect to remove player from list 
    print('User disconnected!')


# 'choice' is a custom event name that we just decided
@socketio.on('choice')
def on_choice(data): # data is whatever arg you pass in your emit call on client
    socketio.emit('choice', data, broadcast=True, include_self=False)

@socketio.on('turn') #When player active, name is added to player board
def on_player_joined(data):
    print(str(data))
    socketio.emit('turn', data, broadcast=True, include_self=True)
    
@socketio.on('game_over')
def on_game_over(data):
    socketio.emit('game_over', data, broadcast=True, include_self=True)

if __name__ == '__main__':
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=False,
        use_reloader=False
    )
