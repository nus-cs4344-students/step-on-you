var SERVER_NAME = "localhost";
var SERVER_PORT = 5019;

function ServiceHelper(lobbyManager){

	var socket;
	var that = this;
	var rtt = 0;
	var offset = 0;

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
						
						var pid = message["id"];
						if(pid !== undefined && pid !== null){
							console.log("client "+pid+" left the room");
							var currentPlayer = gameEngine.thisPlayerID;
							gameEngine.removePlayer(pid);
							if(pid == currentPlayer){
								callback("leave", message);
							}else{
								callback("update", message); //to get the updated lag
							}
						}

					case "update":
						//console.log("NETWORKUPDATE: " + message.type);
						gameEngine.processUpdate(message);
						//console.log("received: " + message.lag);
						callback("update", message);

						break;	
					
					case "sync":
						//console.log(message);
						calcOffset(message);
						break;
                default: 
                    console.log("serverMsg", "unhandled message type " + message.type);
                }
            }
        } catch (e) {
            console.log("Failed to connect to " + "http://" + SERVER_NAME + ":" + SERVER_PORT);
        }
    }

	var testLag = false;
	//simulate different players having different latencies
	//change max, min values in order to alter how different the latencies are between players
	var max = 100;
	var min = 0;
	var temp = Math.floor(Math.random()*(max-min+1)+min);
	var sendToServer = function (msg) {
		var date;
		var currentTime;
		if(testLag){
			var testDelay;
			var errorPercentage = 20;
			var to = temp + errorPercentage*temp/100;
			var from = temp - errorPercentage*temp/100;
			if (temp != 0) {
				testDelay = Math.floor(Math.random() * (to - from + 1) + from);
			} else {
				testDelay = 0;
			}
			date = new Date();
			currentTime = date.getTime();
			msg["timestamp"] = currentTime + offset;
			setTimeout(function(){socket.send(JSON.stringify(msg));}, testDelay);
			console.log("Artificial delay: " + testDelay);
		}else{
			date = new Date();
			currentTime = date.getTime();
			msg["timestamp"] = currentTime + offset;
			socket.send(JSON.stringify(msg));
		}
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
		console.log("this client is leaving the room: " + playerId);
		sendToServer({type:"leave", playerID:playerId});
	}
	
	this.sendMove = function(PID, KP){
		//console.log("sending move: " + PID + " keypress: " + KP);
		sendToServer({type:"move", playerID:PID, keyPress:KP});
	}
	
	this.syncClocks = function(){
		socket.send(JSON.stringify({type:"sync", timestamp:(new Date).getTime()}));
	}
	
	var calcOffset = function(msg){
		var t3 = (new Date).getTime();
		var t0 = msg.t0;
		var t1 = msg.t1;
		var t2 = msg.t2;
		rtt = (t3 - t0) - (t2 - t1);
		offset = ((t1 - t0) + (t2 - t3)) / 2;
	}
}