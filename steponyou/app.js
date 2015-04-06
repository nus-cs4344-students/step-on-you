// enforce strict/clean programming
"use strict"; 

var LIB_PATH = "./";
// require(LIB_PATH + "Pong.js");
// require(LIB_PATH + "Ball.js");
// require(LIB_PATH + "Paddle.js");
var ServerPlayer = require('./models/ServerPlayer.js');
var Room = require('./models/Room.js');
function SuperMarioServer() {
	// Private Variables
	var port;         // Game port 
	this.count = 0;        // Keeps track how many people are connected to server 
	this.gameInterval; // Interval variable used for gameLoop 

	this.playerRoomNoMap = {};      // Mapping from player id -> his room number
	this.playerConnectionIDmap = {} // Mapping from connection id -> player id
	this.rooms = {};
	var NO_OF_ROOMS = 2;
	for(var i=0; i<NO_OF_ROOMS; i++){
		this.rooms[i] = new Room(i);//X should be new Game engine
		this.rooms[i].generateUpdateState();
	};
	this.players = {}; //Mapping from player id-> player
	var that = this;
	/*
	 * private method: reset()
	 *
	 * Reset the game to its initial state.  Clean up
	 * any remaining timers.  Usually called when the
	 * connection of a player is closed.
	 */
	var reset = function () {
		// Clears gameInterval and set it to undefined
		// if (gameInterval !== undefined) {
		// 	clearInterval(gameInterval);
		// 	gameInterval = undefined;
		// }
	}

	/*
	 * private method: gameLoop()
	 *
	 * The main game loop.  Called every interval at a
	 * period roughly corresponding to the frame rate 
	 * of the game
	 */
	var gameLoop = function () {
		// Update on player side
	}
	//Return a playerID by using the supplied connection socket id
	function findPlayerByConnectionID(connID){
		for(var connectionID in that.playerConnectionIDmap){
			if(connID == connectionID){
				return that.playerConnectionIDmap[connID];
			}
		}
		return null;
	}

	/*
	 * private method: startGame()
	 *
	 * Start a new game.  Check if we have at least two 
	 * players and a game is not already running.
	 * If everything is OK, get the ball moving and start
	 * the game loop.
	 */
	var startGame = function () {
		if (gameInterval !== undefined) {
			// There is already a timer running so the game has 
			// already started.
			console.log("Already playing!");
		} else {
			// Everything is a OK
			gameInterval = setInterval(function() {gameLoop();}, 1000/Pong.FRAME_RATE);
		}
	}
	this.getAvailability = function(){
		var result = {};
		for(var i=0; i<NO_OF_ROOMS; i++){
			result[i] = this.rooms[i].getCurrentNoOfPlayers();			
		}
		return result;
	}
	/*
	 * priviledge method: start()
	 *
	 * Called when the server starts running.  Open the
	 * socket and listen for connections.  Also initialize
	 * callbacks for socket.
	 */
	this.start = function () {
		try {
			var express = require('express');
			var http = require('http');
			var sockjs = require('sockjs');
			var sock = sockjs.createServer();

			// reinitialize 
			this.count = 0;
			
			// Upon connection established from a client socket
			sock.on('connection', function (conn) {
				// Sends to client

				// When the client closes the connection to the server/closes the window
				conn.on('close', function () {
					var playerID = that.playerConnectionIDmap[conn.id];					
					var roomID = that.playerRoomNoMap[playerID];
					// if(that.rooms[roomID].getPlayer(playerID) != null){
					// 	that.rooms[roomID].getPlayer(playerID).status = 2;
					// }
					if(roomID === undefined)
						return;

					if(that.rooms[roomID].getPlayer(playerID) == null){
						return;
					}
					that.count--;
					that.rooms[roomID].removePlayer(playerID);
					delete that.playerConnectionIDmap[conn.id];
					delete that.playerRoomNoMap[playerID];
					delete that.players[playerID];

					// Wait for 15s then Remove player who wants to quit/closed the window
					// setTimeout(function(){
						// if(that.players[playerID].status == 2){
							//This player has not been able to connect back after 15s => remove him
							// that.count--;
							// that.rooms[roomID].removePlayer(playerID);
							// delete that.playerConnectionIDmap[conn.ID];
							// delete that.playerRoomNoMap[playerID];
							// delete that.players[playerID];
						// }else{
							//This player has changed connection id since he reconnected
							//Remove the old connection id;
							// delete that.playerConnectionIDmap[conn.ID];
						// }

					// },15000);
					
				});

				// When the client send something to the server.
				conn.on('data', function (data) {					
					var message = JSON.parse(data);
					//If connection id is not in the map and he send his existing player id, it's possible this 
					//player just recover from a failed connection
					
					if(!(conn.id in that.playerConnectionIDmap)){
						var playerID = data["player_id"];
							if(playerID !== undefined){

								console.log(playerID);
								console.log("Recover player!!!");
								if(playerID != null){
								that.playerConnectionIDmap[connID] = playerID;
								var rmNo = that.playerRoomNoMap[playerID];
								that.rooms[rmNo].getPlayer[playerID].status = 0;
							}
						}
					}
					switch (message.type) {
						case "join":
							//TODO: Handle case when player join then leave room and rejoin room again
							var rmID = message.roomID;				
							var playerID = message.playerID;
							var player = that.players[playerID];
							player.status = 0;

							if(that.rooms[rmID].addPlayer(player,conn)){
								that.playerRoomNoMap[playerID] = rmID;
								conn.write(JSON.stringify({type:"joinRoom", status:"pass"}))

							}else{
								conn.write(JSON.stringify({type:"joinRoom", status:"fail", message:"Room is full, cannot join room "+rmID}));
							}
							break;

						case "number_of_players":
							conn.write(JSON.stringify({type:"roomList", rooms:that.getAvailability()}));
							break;
						case "new_player":
							that.count++;
							var player = new ServerPlayer(that.count, conn.id, "angle", 0, 0);
							that.playerConnectionIDmap[conn.id] = that.count;
							that.players[that.count] = player;
							conn.write(JSON.stringify({type:"new_player", status:"pass", id:that.count}));
							break;
						case "move":
							var player_id = message.playerID;
							var keypress = message.keyPress;
							var timestamp = message.timestamp;
							var rmNo = that.playerRoomNoMap[player_id];

							if(that.rooms[rmNo] !== undefined && that.rooms[rmNo] !== null) 
								that.rooms[rmNo].updatePlayer(player_id, keypress, timestamp);
							break;
						
						case "leave":
							var player_id = message.playerID;
							console.log("playerID: " + player_id + " left room");
							that.count--;
							var roomID = that.playerRoomNoMap[player_id];
							if(roomID === undefined)
								return;

							that.rooms[roomID].removePlayer(player_id);
							// delete that.playerConnectionIDmap[conn.id];
							delete that.playerRoomNoMap[player_id];
							// delete that.players[player_id];
							// conn.write(JSON.stringify({type:"leave", status:"pass", id:player_id}));
							break;

						default:
							console.log("Unhandled " + message.type);
					}
				}); // conn.on("data"
			}); // socket.on("connection"

			// Standard code to starts the Pong server and listen
			// for connection

			var path = require('path');
			var favicon = require('serve-favicon');
			var logger = require('morgan');
			var cookieParser = require('cookie-parser');
			var bodyParser = require('body-parser');

			var routes = require('./routes/index');
			var users = require('./routes/users');
			var app = express();

			// view engine setup
			app.set('views', path.join(__dirname, 'views'));
			// app.set('view engine', 'jade');
			
			// uncomment after placing your favicon in /public
			//app.use(favicon(__dirname + '/public/favicon.ico'));
			app.use(logger('dev'));
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({ extended: false }));
			app.use(cookieParser());
			app.use(express.static(path.join(__dirname, 'public')));
			app.use(express.static(__dirname));

			app.use('/', routes);
			app.use('/users', users);

			// catch 404 and forward to error handler
			app.use(function(req, res, next) {
				var err = new Error('Not Found');
				err.status = 404;
				next(err);
			});

			// error handlers

			// development error handler
			// will print stacktrace
			if (app.get('env') === 'development') {
				app.use(function(err, req, res, next) {
					res.status(err.status || 500);
					res.render('error', {
						message: err.message,
						error: err
					});
				});
			}

			// production error handler
			// no stacktraces leaked to user
			app.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.render('error', {
					message: err.message,
					error: {}
				});
			});


			module.exports = app;

			var httpServer = http.createServer(app);
			sock.installHandlers(httpServer, {prefix:'/mario'});
			httpServer.listen(3000, httpServer.address());

			app.use(express.static(__dirname));

		} catch (e) {
			console.log("Cannot listen to " + port);
			console.log("Error: " + e);
		}
	}
}

// This will auto run after this script is loaded
var gameServer = new SuperMarioServer();
gameServer.start();
