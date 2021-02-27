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

## Known problems and how I would address them in the future. 
1. After a handful of games the game becomes laggy and performace begins to dwindle. 
2. The program sometimes takes 20+ seconds to notice that a player has disconnected, which can leave the other players waiting in a state of limbo. I would address this somehow contacting the server once a player leaves or increase the frequency when it checks for any disconnections.
3. When players leave, the list will remove the disconnected player, but will leave an empty space where their name once was. I plan on fixing this by changing how the server processes disconnected players.

## Technical issues and how you solved it (your process, what you searched, what resources you used)
1. I had an issue where the sockets would fire several times, which made the console messy and slowed the performance of the app. So I used `socket.off('MY_EVENT', doThisOnlyOnce).on('MY_EVENT', doThisOnlyOnce);` to make certain sockets send one time. (https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d)
2. Disconnecting players broke the application when deployed on to Heroku because many players were left with an inaccessible board until the server would reset on its own. I fixed this by creating a sequence of socket emits and functions that would give existing players an option to fill in the empty spots.


