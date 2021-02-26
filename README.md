# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

# Rules 
1. Log in with username of your choice
2. If you are one of the first two people to log in, you will play Tic Tac Toe with a live audience.
3. X will go first for the first game, the first move will switch back and forth between the players.

## Known problems and how I would address them in the future. 
1. After a hand ful of games the game becomes laggy and performace begins to dwindle. 
2. 

## Technical issues and how you solved it (your process, what you searched, what resources you used)
1. I had an issue where the sockets would fire several times, which made the console messy and slowed the performance of the app. So I used `socket.off('MY_EVENT', doThisOnlyOnce).on('MY_EVENT', doThisOnlyOnce);` to make certain sockets send one time. (https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d)
2. 

