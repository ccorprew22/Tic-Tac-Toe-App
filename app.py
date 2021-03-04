import os
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) # This is to load your env variables from .env

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import Players
db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False,
    ping_interval=1
)

global NUM_PLAYERS
NUM_PLAYERS = 0
global TWO_PLAYER
TWO_PLAYER = ["", ""]
global OVERALL_LST
OVERALL_LST = ["Waiting for player", "Waiting for player"] #{sid : socketio.id, username : user}
global REPLAY_LST
REPLAY_LST = []
global DISPLAY_LST #Temporary solution for problem involving empty spots on player list after disconnect, current problem is handling changing list length
DISPLAY_LST = []
#global leaderboard
#leaderboard = []

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
    global OVERALL_LST
    global TWO_PLAYER
    global DISPLAY_LST
    removed_user = ""
    for i in range(len(OVERALL_LST)):
        if type(OVERALL_LST[i]) is str:
            continue
        elif OVERALL_LST[i]['sid'] == request.sid:
            removed_user = OVERALL_LST[i]
            OVERALL_LST[i] = "Disconnected Player"
            break
    if request.sid in TWO_PLAYER:
        index = TWO_PLAYER.index(request.sid)
        TWO_PLAYER[index] = "Disconnected Player"
    if removed_user in DISPLAY_LST:
        DISPLAY_LST.remove(removed_user)
    #send data on disconnect to remove player from list
    message = {'player_lst': OVERALL_LST, 'player_left': request.sid, 'display_lst' : DISPLAY_LST}
    print('User disconnected! : ' + request.sid)
    socketio.emit('disconnect', message, broadcast=True, include_self=True)
    
#Removes log in div
@socketio.on('remove_login')
def on_remove_login(data):
    socketio.emit("remove_login", data, broadcast=True, include_self=True)

#When player logs in with username
@socketio.on('player_joined') #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
def on_player_joined(data):
    global NUM_PLAYERS
    global TWO_PLAYER
    global OVERALL_LST
    global DISPLAY_LST
    #database check
    #bool(session.query(Players.Player).filter_by(username='username').first())
    player_user = Players.Player.query.filter_by(username=data['username']).scalar()
    if player_user == None:
        new_user = Players.Player(username=data['username'], score=100)
        db.session.add(new_user)
        db.session.commit()
        
    if OVERALL_LST[0] == "Waiting for player": #did this for display.js after removing login
        OVERALL_LST[0] = {'sid' : data['sid'], 'username' : data['username']}
    elif OVERALL_LST[1] == "Waiting for player":
        OVERALL_LST[1] = {'sid' : data['sid'], 'username' : data['username']}
    else: #after first two players are found
        OVERALL_LST.append({'sid' : data['sid'], 'username' : data['username']})
    #print(player_lst)
    #overall_lst.append({'sid' : data['sid'], 'username' : data['username']})
    NUM_PLAYERS += 1
    data['num_players'] = NUM_PLAYERS
    if TWO_PLAYER[0] == "":
        TWO_PLAYER[0] = data['sid']
    elif TWO_PLAYER[1] == "":
        TWO_PLAYER[1] = data['sid'] 
    late_join = True #Game in session
    if "Disconnected Player" in TWO_PLAYER:
        late_join = False #Looking for new player
    DISPLAY_LST.append({'sid' : data['sid'], 'username' : data['username']})
    #leaderboard
    all_rankings = Players.Player.query.order_by(Players.Player.score.desc()).all()
    leaderboard = [] #{'username': username, 'score' : score}
    for player in all_rankings:
        leaderboard.append({'username' : player.username, 'score': player.score})
    
    data['two_players'] = TWO_PLAYER #Player list
    data['players'] = OVERALL_LST #Overall list usernames {sid: sid, username: username}
    data['late_join'] = late_join
    data['display_lst'] = DISPLAY_LST
    data['leaderboard'] = leaderboard
    print(data)
    socketio.emit('player_joined', data, broadcast=True, include_self=True) #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [{sid: sid, user: user}], display_lst : display_lst, leaderboard : [{username: username, score: score}]}
 
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
def on_game_over(data): #{winner: winner, X: two_player.X, O: two_player.O, champ: sId}
    global OVERALL_LST
    #using display_lst is faster than looping through player list
    if data['champ'] == data['X']:
        print("GAME OVER!!!")
        X = list(filter(lambda x: x if(type(x) == dict and x['sid'] == data['X']) else False, OVERALL_LST))
        O = list(filter(lambda x: x if(type(x) == dict and x['sid'] == data['O']) else False, OVERALL_LST))
        player_winner = db.session.query(Players.Player).filter_by(username=X[0]['username']).first()
        player_winner.score += 1
        db.session.commit()
        player_loser = db.session.query(Players.Player).filter_by(username=O[0]['username']).first()
        player_loser.score -= 1
        db.session.commit()
        #print(playerWinner)
        winner_score = player_winner.score
        #loserScore = playerLoser.score
        print(winner_score)
        
    elif data['champ'] == data['O']:
        player_winner = db.session.query(Players.Player).filter_by(username=O[0]['username']).first()
        player_winner.score += 1
        db.session.commit()
        player_loser = db.session.query(Players.Player).filter_by(username=X[0]['username']).first()
        player_loser.score -= 1
        db.session.commit()
    #sending updated leaderboard
    all_rankings = Players.Player.query.order_by(Players.Player.score.desc()).all()
    leaderboard = [] #{'username': username, 'score' : score}
    for player in all_rankings:
        leaderboard.append({'username' : player.username, 'score': player.score})
    data['leaderboard'] = leaderboard
    champ_user = [{'sid' : data['X'], 'user' : TWO_PLAYER[0]}, {'sid' : data['O'], 'user': TWO_PLAYER[1]}]
    data["champ_user"] = champ_user
    socketio.emit('game_over', data, broadcast=True, include_self=True)

#Replay
@socketio.on("replay")
def on_replay(data): #socket.id
    global REPLAY_LST
    global TWO_PLAYER
    if "Disconnected Player" in TWO_PLAYER: #to fill open spot
        if data['sid'] not in TWO_PLAYER:
            index = TWO_PLAYER.index("Disconnected Player")
            TWO_PLAYER[index] = data['sid']
            REPLAY_LST.append(data['sid'])
    if data['sid'] in TWO_PLAYER and data['sid'] not in REPLAY_LST:
        REPLAY_LST.append(data['sid'])
    
    if len(REPLAY_LST) == 2:
        data = [True, len(REPLAY_LST), TWO_PLAYER, OVERALL_LST]
        REPLAY_LST = []
    socketio.emit("replay", data, broadcast=True, include_self=True)

if __name__ == '__main__':
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=False,
        use_reloader=False
    )
