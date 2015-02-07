













/*
 * PongServer.js
 * A skeleton server for two-player Pong game.
 * Assignment 2 for CS4344, AY2013/14.
 * Modified from Davin Choo's AY2012/13 version.
 *
 * Changes from AY2012/13:
 *  - migrate from socket.io to sockjs
 *
 * Usage: 
 *   node PongServer.js
 */

// enforce strict/clean programming
"use strict"; 

var LIB_PATH = "./";
// require(LIB_PATH + "Pong.js");
// require(LIB_PATH + "Ball.js");
// require(LIB_PATH + "Paddle.js");
// require(LIB_PATH + "Player.js");

function PongServer() {
	// Private Variables
	var port;         // Game port 
	var count;        // Keeps track how many people are connected to server 
	var nextPID;      // PID to assign to next connected player (i.e. which player slot is open) 
	var gameInterval; // Interval variable used for gameLoop 
	var ball;         // the game ball 
	var sockets;      // Associative array for sockets, indexed via player ID
	var players;      // Associative array for players, indexed via socket ID
	var p1, p2;       // Player 1 and 2.

	/*
	 * private method: broadcast(msg)
	 *
	 * broadcast takes in a JSON structure and send it to
	 * all players.
	 *
	 * e.g., broadcast({type: "abc", x: 30});
	 */
	var broadcast = function (msg) {
		var id;
		for (id in sockets) {
			sockets[id].write(JSON.stringify(msg));
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
	 * private method: newPlayer()
	 *
	 * Called when a new connection is detected.  
	 * Create and init the new player.
	 */
	var newPlayer = function (conn) {
		// count ++;
		// // 1st player is always top, 2nd player is always bottom
		// var watchPaddle = (nextPID === 1) ? "top" : "bottom";
		// var startPos = (nextPID === 1) ? Paddle.HEIGHT : Pong.HEIGHT;

		// // Send message to new player (the current client)
		// unicast(conn, {type: "message", content:"You are Player " + nextPID + ". Your paddle is at the " + watchPaddle});

		// // Create player object and insert into players with key = conn.id
		// players[conn.id] = new Player(conn.id, nextPID, startPos);
		// sockets[nextPID] = conn;

		// // Mark as player 1 or 2
		// if (nextPID == 1) {
		// 	p1 = players[conn.id];
		// } else if (nextPID == 2) {
		// 	p2 = players[conn.id];
		// }

		// // Updates the nextPID to issue (flip-flop between 1 and 2)
		// nextPID = ((nextPID + 1) % 2 === 0) ? 2 : 1;
	}

	/*
	 * private method: gameLoop()
	 *
	 * The main game loop.  Called every interval at a
	 * period roughly corresponding to the frame rate 
	 * of the game
	 */
	var gameLoop = function () {
		// Check if ball is moving
		// if (ball.isMoving()) {

		// 	// Move paddle (in case accelerometer is used and vx is non-zero).
		// 	p1.paddle.moveOneStep();
		// 	p2.paddle.moveOneStep();

		// 	// Move ball
		// 	ball.moveOneStep(p1.paddle, p2.paddle);

		// 	// Update on player side
		// 	var bx = ball.x;
		// 	var by = ball.y;
		// 	var states = { 
		// 		type: "update",
		// 		ballX: bx,
		// 		ballY: by,
		// 		myPaddleX: p1.paddle.x,
		// 		myPaddleY: p1.paddle.y,
		// 		opponentPaddleX: p2.paddle.x,
		// 		opponentPaddleY: p2.paddle.y};
		// 	setTimeout(unicast, p1.getDelay(), sockets[1], states);
		// 	states = { 
		// 		type: "update",
		// 		ballX: bx,
		// 		ballY: by,
		// 		myPaddleX: p2.paddle.x,
		// 		myPaddleY: p2.paddle.y,
		// 		opponentPaddleX: p1.paddle.x,
		// 		opponentPaddleY: p1.paddle.y};
		// 	setTimeout(unicast, p2.getDelay(), sockets[2], states);
		// } else {
		// 	// Reset
		// 	reset();
		// }
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
		// if (gameInterval !== undefined) {
		// 	// There is already a timer running so the game has 
		// 	// already started.
		// 	console.log("Already playing!");

		// } else if (Object.keys(players).length < 2) {
		// 	// We need two players to play.
		// 	console.log("Not enough players!");
		// 	broadcast({type:"message", content:"Not enough player"});

		// } else {
		// 	// Everything is a OK
		// 	ball.startMoving();
		// 	gameInterval = setInterval(function() {gameLoop();}, 1000/Pong.FRAME_RATE);
		// }
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
			// count = 0;
			// nextPID = 1;
			// gameInterval = undefined;
			// ball = new Ball();
			// players = new Object;
			// sockets = new Object;
			
			// Upon connection established from a client socket
			sock.on('connection', function (conn) {
				console.log("connected");
				// Sends to client
				broadcast({type:"message", content:"There is now " + count + " players"});

				if (count == 2) {
					// Send back message that game is full
					unicast(conn, {type:"message", content:"The game is full.  Come back later"});
					// TODO: force a disconnect
				} else {
					// create a new player
					newPlayer(conn);
				}

				// When the client closes the connection to the server/closes the window
				conn.on('close', function () {
					// Stop game if it's playing
					reset();

					// Decrease player counter
					count--;

					// Set nextPID to quitting player's PID
					nextPID = players[conn.id].pid;

					// Remove player who wants to quit/closed the window
					if (players[conn.id] === p1) p1 = undefined;
					if (players[conn.id] === p2) p2 = undefined;
					delete players[conn.id];

					// Sends to everyone connected to server except the client
					broadcast({type:"message", content: " There is now " + count + " players."});
				});

				// When the client send something to the server.
				conn.on('data', function (data) {
					var message = JSON.parse(data)

					switch (message.type) {
						// one of the player starts the game.
						case "start": 
							startGame();
							break;

						// one of the player moves the mouse.
						case "move":
							setTimeout(function() {
								players[conn.id].paddle.move(message.x);
							},
							players[conn.id].getDelay());
							break;
							
						// one of the player moves the mouse.
						case "accelerate":
							setTimeout(function() {
								players[conn.id].paddle.accelerate(message.vx);
							},
							players[conn.id].getDelay());
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
			sock.installHandlers(httpServer, {prefix:'/pong'});
			httpServer.listen(3000, '0.0.0.0');
			app.use(express.static(__dirname));

		} catch (e) {
			console.log("Cannot listen to " + port);
			console.log("Error: " + e);
		}
	}
}

// This will auto run after this script is loaded
var gameServer = new PongServer();
gameServer.start();

// vim:ts=4:sw=4:expandtab
