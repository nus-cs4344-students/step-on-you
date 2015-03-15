// enforce strict/clean programming
"use strict"; 

var LIB_PATH = "./";
// require(LIB_PATH + "Pong.js");
// require(LIB_PATH + "Ball.js");
// require(LIB_PATH + "Paddle.js");
var Player = require('./models/Player.js');
var Room = require('./models/Room.js');
function SuperMarioServer() {
	// Private Variables
	var port;         // Game port 
	var count;        // Keeps track how many people are connected to server 
	var gameInterval; // Interval variable used for gameLoop 

	var players = {};      // Mapping from player id -> his room number
	var rooms = {};
	var NO_OF_ROOMS = 20;
	for(var i=0; i<NO_OF_ROOMS; i++){
		rooms[i] = new Room("X", i);//X should be new Game engine
	};
	/*
	 * private method: broadcast(msg)
	 *
	 * broadcast takes in a JSON structure and send it to
	 * all players in a room with roomID.
	 *
	 * e.g., broadcast({type: "abc", x: 30},1);
	 */
	var broadcast = function (msg, roomID) {
		var id;
		var sockets = this.rooms[roomID].getSockets();
		for (socket in sockets) {
			socket.write(JSON.stringify(msg));
		}
	}

	/*
	 * private method: unicast(socket, msg)
	 *
	 * unicast takes in a socket and a JSON structure 
	 * and send the message through the given socket.
	 *
	 * e.g., unicast(socket, {type: "abc", x: 30});
	 */
	var unicast = function (socket, msg) {
		socket.write(JSON.stringify(msg));
	}

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
		broadcast({"type":"update", "content":players});
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
			count = 0;
			
			// Upon connection established from a client socket
			sock.on('connection', function (conn) {
				// Sends to client
				broadcast({type:"message", content:"There is now " + count + " players"});

				// When the client closes the connection to the server/closes the window
				conn.on('close', function () {
					// Decrease player counter
					count--;
					var roomID = this.players[conn.id];
					// Remove player who wants to quit/closed the window
					this.rooms[roomID].removePlayer(conn.id);
					delete this.players[conn.id];

					// Sends to everyone connected to server except the client
					broadcast({type:"message", content: " There is now " + count + " players."});
				});

				// When the client send something to the server.
				conn.on('data', function (data) {
					var message = JSON.parse(data)

					switch (message.type) {
						// one of the player moves the mouse.
						case "join":
							var rmID = message.roomID;				
							var player = new Player("test", 0, 0, conn.id);
							if(this.rooms[rmID].addPlayer(player)){
								count++;
								conn.write(JSON.stringify({"status":"OK"}))
							}else{
								conn.write(JSON.stringify({"status":"fail", "message":"Room is full, cannot join room"+rmID}));
							}
						case "move":
							var player = players[conn.id];
							console.log(player);
							break;
							
						// one of the player moves the mouse.
						case "accelerate":

							break;

						// one of the player change the delay
						case "delay":
							players[conn.id].delay = message.delay;
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
			httpServer.listen(3000, '0.0.0.0');
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
