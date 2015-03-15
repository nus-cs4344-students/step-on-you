var SERVER_NAME = "localhost";
var SERVER_PORT = 3000;

function ServiceHelper(lobbyManager){

	var socket;
	this.roomList;
	var roomChosen = false;
	var chooseRoom = false;
	var lobby = lobbyManager;
	
	this.initNetwork = function() {
        try {
            socket = new SockJS("http://" + SERVER_NAME + ":" + SERVER_PORT + "/mario");
            socket.onmessage = function (e) {
                var message = JSON.parse(e.data);
                switch (message.type) {
                case "roomList":
					roomList = message.rooms;
					lobby.updateRoomList(roomList);
					chooseRoom = true;
					break;
				case "joinRoom":
					switch(message.status){
					case "pass":
						roomChosen = true;
						chooseRoom = false;
						lobby.setRoom(roomId);
						break;
					case "fail":
						roomChosen = false;
						chooseRoom = true;
						lobby.setRoom(-1);
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
	
	this.requestRoomList = function(){
		sendToServer({type:"number_of_players"});
	}
	
	this.joinRoom = function(roomid){
		sendToServer({type:"join", roomID:roomid});
	}
	
}