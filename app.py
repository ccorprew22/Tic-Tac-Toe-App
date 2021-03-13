'''
    app.py

    Server file.
'''

import os
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # This is to load your env variables from .env

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import Players
DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False,
                    ping_interval=1)

#global NUM_PLAYERS
NUM_PLAYERS = 0
#global TWO_PLAYER
TWO_PLAYER = ["", ""]
#global OVERALL_LST
OVERALL_LST = ["Waiting for player",
               "Waiting for player"]  #{sid : socketio.id, username : user}
#global REPLAY_LST
REPLAY_LST = []
#Temporary solution for problem involving empty spots on player list after disconnect,
#current problem is handling changing list length
#global DISPLAY_LST
DISPLAY_LST = []
#global leaderboard
#leaderboard = []


@APP.route('/', defaults={"filename": "index.html"})
#@app.route('/<path:filename>')
def index(filename):
    """index file"""
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    """Handles a connect user to the socket"""
    #sid = request.sid #socket id
    print("User connected! " + request.sid)
    #socketio.emit('connect', player_lst, broadcast=True, include_self=True)


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """
    Handles removing player from player lists after disconnecting
    """
    #global OVERALL_LST
    #global TWO_PLAYER
    #global DISPLAY_LST
    removed_user = ""
    for i in range(len(OVERALL_LST)):
        if isinstance(OVERALL_LST[i], str):
            print("not it")
            #continue
        elif OVERALL_LST[i]['sid'] == request.sid:
            removed_user = OVERALL_LST[i]
            OVERALL_LST[i] = "Disconnected Player"
            break
    if request.sid in TWO_PLAYER:
        _index_ = TWO_PLAYER.index(request.sid)
        TWO_PLAYER[_index_] = "Disconnected Player"
    if removed_user in DISPLAY_LST:
        DISPLAY_LST.remove(removed_user)
    #send data on disconnect to remove player from list
    message = {
        'player_lst': OVERALL_LST,
        'player_left': request.sid,
        'display_lst': DISPLAY_LST
    }
    print('User disconnected! : ' + request.sid)
    SOCKETIO.emit('disconnect', message, broadcast=True, include_self=True)
    return [OVERALL_LST, DISPLAY_LST]


#Removes log in div
@SOCKETIO.on('remove_login')
def on_remove_login(data):
    """Changes front page after login to show board instead of login"""
    SOCKETIO.emit("remove_login", data, broadcast=True, include_self=True)


#When player logs in with username
#{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
@SOCKETIO.on('player_joined')
def on_player_joined(data):
    """Function that handles adding players to the database and player list after logging in"""
    global NUM_PLAYERS
    #database check
    #bool(session.query(Players.Player).filter_by(username='username').first())
    try:
        add_username(data['username'])
    except:
        pass

    if OVERALL_LST[
            0] == "Waiting for player":  #did this for display.js after removing login
        OVERALL_LST[0] = {'sid': data['sid'], 'username': data['username']}
    elif OVERALL_LST[1] == "Waiting for player":
        OVERALL_LST[1] = {'sid': data['sid'], 'username': data['username']}
    else:  #after first two players are found
        OVERALL_LST.append({'sid': data['sid'], 'username': data['username']})
    #print(player_lst)
    #overall_lst.append({'sid' : data['sid'], 'username' : data['username']})
    NUM_PLAYERS += 1
    data['num_players'] = NUM_PLAYERS
    if TWO_PLAYER[0] == "":
        TWO_PLAYER[0] = data['sid']
    elif TWO_PLAYER[1] == "":
        TWO_PLAYER[1] = data['sid']
    late_join = True  #Game in session
    if "Disconnected Player" in TWO_PLAYER:
        late_join = False  #Looking for new player
    DISPLAY_LST.append({'sid': data['sid'], 'username': data['username']})
    #leaderboard
    all_rankings = Players.Player.query.order_by(
        Players.Player.score.desc()).all()
    leaderboard = []  #{'username': username, 'score' : score}
    for player in all_rankings:
        leaderboard.append({
            'username': player.username,
            'score': player.score
        })

    data['two_players'] = TWO_PLAYER  #Player list
    data[
        'players'] = OVERALL_LST  #Overall list usernames {sid: sid, username: username}
    data['late_join'] = late_join
    data['display_lst'] = DISPLAY_LST
    data['leaderboard'] = leaderboard
    #print(data)
    SOCKETIO.emit('player_joined', data, broadcast=True, include_self=True)
    #{ sid: socket.id, username : username, num_players: num_players,
    #two_players: [], players: [{sid: sid, user: user}],
    #display_lst : display_lst, leaderboard : [{username: username, score: score}]}
    print(TWO_PLAYER)
    return TWO_PLAYER


def add_username(user):
    """Adds username to database if doesn't already exist"""

    #player_user = Players.Player.query.filter_by(username=user).scalar()
    try:
        new_user = Players.Player(username=user, score=100)
        DB.session.add(new_user)
        #print("added")
        DB.session.commit()
        print("New")
        return "New User Added: " + user
    except:
        DB.session.rollback()
        print("Existing")
        return "Existing User: " + user


@SOCKETIO.on('choice')
def on_choice(
        data):  # data is whatever arg you pass in your emit call on client
    """Sends move choice to other users"""
    SOCKETIO.emit('choice', data, broadcast=True, include_self=False)


#When player makes turn change
@SOCKETIO.on('turn')
def on_turn(data):
    """Sends change of turn to other player"""
    print(str(data))
    SOCKETIO.emit('turn', data, broadcast=True, include_self=True)


@SOCKETIO.on('game_over')
#{winner: winner, X: two_player.X, O: two_player.O, champ: sId}
def on_game_over(data):
    """Handles the sharing the information to all users after a game has ended"""
    global OVERALL_LST
    #using display_lst is faster than looping through player list
    score_update(data['champ'], data['X'], data['O'])
    #sending updated leaderboard
    all_rankings = Players.Player.query.order_by(
        Players.Player.score.desc()).all()
    leaderboard = []  #{'username': username, 'score' : score}
    for player in all_rankings:
        leaderboard.append({
            'username': player.username,
            'score': player.score
        })
    data['leaderboard'] = leaderboard
    champ_user = [{
        'sid': data['X'],
        'user': TWO_PLAYER[0]
    }, {
        'sid': data['O'],
        'user': TWO_PLAYER[1]
    }]
    data["champ_user"] = champ_user
    SOCKETIO.emit('game_over', data, broadcast=True, include_self=True)


def score_update(champ, X, O): #all sids
    """Update score for winner and loser"""
    #returns list of 1 length with dictionary of {sid, username}
    global OVERALL_LST
    winner = None
    loser = None
    x_player = list(
        filter(
            lambda x: x if (isinstance(x, dict) and x['sid'] == X) else False,
            OVERALL_LST))
    o_player = list(
        filter(
            lambda x: x if (isinstance(x, dict) and x['sid'] == O) else False,
            OVERALL_LST))
    if champ == X:
        winner = x_player
        loser = o_player
    elif champ == O:
        winner = o_player
        loser = x_player
        #print("GAME OVER!!!")
    player_winner = DB.session.query(Players.Player).filter(
        Players.Player.username == winner[0]['username']).first()
    player_winner.score += 1
    DB.session.commit()
    player_loser = DB.session.query(Players.Player).filter(
        Players.Player.username == loser[0]['username']).first()
    player_loser.score -= 1
    DB.session.commit()
    return [player_winner.score, player_loser.score]
    

#Replay
@SOCKETIO.on("replay")
def on_replay(data):  #socket.id
    """
    Handles the game in the event of a rematch. Both players have
    to hit the rematch button OR New player game button
    """
    global REPLAY_LST
    #global TWO_PLAYER
    if "Disconnected Player" in TWO_PLAYER:  #to fill open spot
        if data['sid'] not in TWO_PLAYER:
            _index_ = TWO_PLAYER.index("Disconnected Player")
            TWO_PLAYER[_index_] = data['sid']
            REPLAY_LST.append(data['sid'])
    if data['sid'] in TWO_PLAYER and data['sid'] not in REPLAY_LST:
        REPLAY_LST.append(data['sid'])
    curr_replay_lst = REPLAY_LST  #so that full list will show after it is emptied
    if len(REPLAY_LST) == 2:
        data = [True, len(REPLAY_LST), TWO_PLAYER, OVERALL_LST]
        REPLAY_LST = []
    SOCKETIO.emit("replay", data, broadcast=True, include_self=True)
    print(REPLAY_LST)
    return curr_replay_lst


if __name__ == '__main__':
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=False,
        use_reloader=False)
