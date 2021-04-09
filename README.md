# Tic Tac Toe 

## Heroku Link
https://glacial-bastion-23362.herokuapp.com/

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Local and Heroku Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project director
2. Login into heroku with `heroku login -i` 
3. Enter `heroku create --buildpack heroku/python`
4. Enter `heroku buildpacks:add --index 1 heroku/nodejs`
5. Enter `git push heroku main`
6. Enter `heroku addons:create heroku-postgresql:hobby-dev`
7. Do `heroku config` and copy the url.
8. Paste that URL into a `DATABASE URL` inside of your `.env` file so that this will work locally.
9. In interactive python session enter:
```
>> from app import db
>> import Players
>> db.create_all()
```

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'
4. Open the app in more than one tab to give it multiple users.

# Rules (ALL under assumption that everyone is present before game starts)
1. Log in with username of your choice
2. If you are one of the first two people to log in, you will play Tic Tac Toe with a live audience.
3. After a winner or a draw is decided, both players have to hit the replay button to clear the board and restart.
4. If one of the two players log out, the game will end, leaving an opportunity for one of the specatators to enter the empty spot.
5. Once a player has disconnected, for some time, the game will ask for players to hit the "New Player Game" button, where if one player is still active, a specatator will also have to hit the button. The first one to hit it will fill the empty spot. If there are no active players, two specatators will have to hit the button.

# Leaderboard
1. Once logged in, if the username is new, they will be added to a database.
2. After winning a game, 1 point is added to your overall score. The opposite happens if you lose.
3. Your rank is based on your score.

## Known problems and how I would address them in the future. 
1. For some reason, if you try to log in, the app will automatically disconnect you. I have only experienced this after quickly logging in right after opening the app. My guess is that the app is still processing the newly connected user, and needs at least 2-3 seconds to work properly.
2. If a player joins in the middle of a game, the board will update for them after the next move made. I plan to send newly joined players the active board when connecting in the future.
3. If a player joins in the middle of a game, the game crashes once the game ends. Refreshing the lobby empty tends to fix the problem.
4. I would like to implement a password function so that people can't just login as someone else.
5. Sometimes a player may disconnect after replacing a disconnected player.
6. Sometimes if a player joins after a few games, one of the names in the display will disappear until the next game.

## Technical issues and solutions
1. I had an issue where the sockets would fire several times, which made the console messy and slowed the performance of the app. So I used `socket.off('MY_EVENT', doThisOnlyOnce).on('MY_EVENT', doThisOnlyOnce);` to make certain sockets send one time. (https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d)
2. Disconnecting players broke the application when deployed on to Heroku because many players were left with an inaccessible board until the server would reset on its own. I fixed this by creating a sequence of socket emits and functions that would give existing players an option to fill in the empty spots.
3. Even though it is still a problem of taking too long, before the time to notice that a player disconnected was 20+ seconds. I dramatically shortened this time by adding a ping interval of 1 second. It still takes 5+ seconds but that is more reasonable. (https://flask-socketio.readthedocs.io/en/latest/)
