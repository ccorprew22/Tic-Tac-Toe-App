import os
from flask import Flask, send_from_directory, json, session
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
global two_player
two_player = []

@app.route('/', defaults={"filename": "index.html"})
#@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    global i
    global two_player
    if len(two_player) < 4:
        two_player.append(i)
    print(two_player)
    print("User " + str(i) + " connected!")
    #print(two_player)
    socketio.emit('connect', [two_player, i], broadcast=True, include_self=True)
    i += 1
    
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'choice' to the server, this function is run
# 'choice' is a custom event name that we just decided
@socketio.on('choice')
def on_choice(data): # data is whatever arg you pass in your emit call on client
    #print(str(data))
    # This emits the 'choice' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('choice', data, broadcast=True, include_self=False)


@socketio.on('player_joined') #When player active, name is added to player board
def on_player_joined(data):
    print(str(data))
    socketio.emit('player_joined', data, broadcast=True, include_self=False)
    
if __name__ == '__main__':
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=False,
        use_reloader=False
    )
