var SERVER_NAME = "localhost";
var SERVER_PORT = 3000;

function ServiceHelper(lobbyManager){

	var socket;
	this.roomList;
	var roomChosen = false;
	var chooseRoom = false;
	var lobby = lobbyManager;
	var PID;
	var that = this;

	this.initNetwork = function(callback) {
		try {
			socket = new SockJS("http://" + SERVER_NAME + ":" + SERVER_PORT + "/mario");
			socket.onopen = function() {
				console.log("connected");
				callback("connection_ready", null);
			};
			socket.onmessage = function (e) {
				var message = JSON.parse(e.data);
				switch (message.type) {
					case "new_player":
					PID = message.id;
					console.log("receive pid: " + PID);
					that.joinRoom(1);
				 	var playerID = PID;
    	
    				//add to engine
			    	var thisPlayer = gameEngine.addPlayer(playerID);
			    	// //add this player to room
			    	thisPlayer.setPosition(800/2 - 15,600-200);
			    	thisPlayer.faceLeft();

			        gameEngine.registerCurrentPlayer(playerID);
	            	gameEngine.start();

					updateVisualizer();
					break;
					case "roomList":
					roomList = message.rooms;
					//lobby.updateRoomList(roomList);
					chooseRoom = true;
					console.log(roomList);
					break;
					case "joinRoom":
					switch(message.status){
						case "pass":
						console.log(message);
						roomChosen = true;
						chooseRoom = false;
						//lobby.setRoom(roomId);
						break;
						case "fail":
						console.log(message);
						roomChosen = false;
						chooseRoom = true;
						//lobby.setRoom(-1);
						break;
						default:
						break;
					}
					break;
					default: 
					appendMessage("serverMsg", "unhandled message type " + message.type);
				}
			}
		} catch (e) {
			console.log("Failed to connect to " + "http://" + SERVER_NAME + ":" + SERVER_PORT);
		}
	}
	
	var sendToServer = function (msg) {
		var date = new Date();
		var currentTime = date.getTime();
		msg["timestamp"] = currentTime;
		socket.send(JSON.stringify(msg));
	}

	this.requestId = function(currentId) {
		var initialMsg = JSON.stringify({"type": "new_player", playerID:currentId});
		socket.send(initialMsg);
		console.log("new_player msg sent");
	}
	
	this.requestRoomList = function(){
		sendToServer({type:"number_of_players"});
	};
	var FPS = 60;
	var timePerFrame = 1000/FPS;

	var updateVisualizer = function(){

		var updatePack = gameEngine.generateUpdate();
		visualizer.update(updatePack);

		//prepare update
		setTimeout( function(){updateVisualizer()}, timePerFrame );
	}

	this.joinRoom = function(roomid){
		console.log(PID);
		sendToServer({type:"join", roomID:roomid, playerID:PID});
	}

	this.getPID = function(){
		return PID;
	}
}