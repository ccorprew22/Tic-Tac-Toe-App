# Tic Tac Toe 

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'
4. Open the app in more than one tab to give it multiple users.

# Rules 
1. Log in with username of your choice
2. If you are one of the first two people to log in, you will play Tic Tac Toe with a live audience.
3. After a winner or a draw is decided, both players have to hit the replay button to clear the board and restart.
4. If one of the two players log out, the game will end, leaving an opportunity for one of the specatators to enter the empty spot.
5. Once a player has disconnected, for some time, the game will ask for players to hit the "New Player Game" button, where if one player is still active, a specatator will also have to hit the button. The first one to hit it will fill the empty spot. If there are no active players, two specatators will have to hit the button.

## Known problems and how I would address them in the future. 
1. For some reason, if you try to log it, the app will automatically disconnect you. I have only experienced this after quickly logging in right after opening the app. My guess is that the app is still processing the newly connected user, and needs at least 2-3 seconds to work properly.
2. The program sometimes takes a while to notice that a player has disconnected, which causes MOST of the problems that you may experience. USUALLY if things start acting weird due to a player disconnecting, waiting for the program to notice a disconnection will fix everything and put everyone back on the same page. 
3. When players leave, the list will remove the disconnected player, but will leave an empty space where their name once was. I plan on fixing this by changing how the server processes disconnected players.

## Technical issues and how you solved it (your process, what you searched, what resources you used)
1. I had an issue where the sockets would fire several times, which made the console messy and slowed the performance of the app. So I used `socket.off('MY_EVENT', doThisOnlyOnce).on('MY_EVENT', doThisOnlyOnce);` to make certain sockets send one time. (https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d)
2. Disconnecting players broke the application when deployed on to Heroku because many players were left with an inaccessible board until the server would reset on its own. I fixed this by creating a sequence of socket emits and functions that would give existing players an option to fill in the empty spots.
3. Even though it is still a problem of taking too long, before the time to notice that a player disconnected was 20+ seconds. I dramatically shortened this time by adding a ping interval of 1 second. It still takes 5+ seconds but that is more reasonable. (https://flask-socketio.readthedocs.io/en/latest/)