var SERVER_NAME = "localhost";
var SERVER_PORT = 3000;

function ServiceHelper(lobbyManager){

	var socket;
	var that = this;

	this.initNetwork = function(callback) {
		try {
			socket = new SockJS("http://" + SERVER_NAME + ":" + SERVER_PORT + "/mario");
			socket.onopen = function() {
				console.log("NETWORK: connected");
				callback("connection_ready", null);
			};
			socket.onmessage = function (e) {
				var message = JSON.parse(e.data);
				switch (message.type) {
					case "new_player":
					//console.log("NETWORK: receive pid: " + message.id);
					callback("new_player", message);
					break;

					case "roomList":
					roomList = message.rooms;
					callback("roomList", roomList);
					// console.log("NETWORK: " + roomList);
					break;
					
					case "joinRoom":
					//console.log("NETWORK: " + message);
					callback("joinRoom", message);
					break;

					case "leave":
					//console.log("NETWORK: " + message);
					callback("leave", message);

				case "update":
					//console.log("NETWORKUPDATE: " + message.type);
					gameEngine.processUpdate(message);

					break;	
                default: 
                    console.log("serverMsg", "unhandled message type " + message.type);
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
		console.log("NETWORK: new_player msg sent");
	}
	
	this.requestRoomList = function(){
		sendToServer({type:"number_of_players"});
	}

	this.joinRoom = function(roomId, playerId){
		sendToServer({type:"join", roomID:roomId, playerID:playerId});
	}

	this.leaveRoom = function(playerId){
		sendToServer({type:"leave", playerID:playerId});
	}
	
	this.sendMove = function(PID, KP){
		console.log("sending move: " + PID + " keypress: " + KP);
		sendToServer({type:"move", playerID:PID, keypress:KP});
	}
}