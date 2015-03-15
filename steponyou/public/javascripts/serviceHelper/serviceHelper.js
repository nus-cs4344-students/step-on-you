var SERVER_NAME = "localhost";
var SERVER_PORT = 3000;

function ServiceHelper(){

	var socket;
	var roomList;
	var roomChosen = false;
	var chooseRoom = false;
	
	var initNetwork = function() {
        try {
            socket = new SockJS("http://" + SERVER_NAME + ":" + PORT + "/pong");
            socket.onmessage = function (e) {
                var message = JSON.parse(e.data);
                switch (message.type) {
                case "roomList":
					roomList = message.rooms;
					chooseRoom = true;
					break;
				case "joinRoom":
					switch(message.status){
					case "pass":
						roomChosen = true;
						chooseRoom = false;
						break;
					case "fail":
						roomChosen = false;
						chooseRoom = true;
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
            console.log("Failed to connect to " + "http://" + SERVER_NAME + ":" + PORT);
        }
    }
	
	var sendToServer = function (msg) {
		var date = new Date();
		var currentTime = date.getTime();
		msg["timestamp"] = currentTime;
		socket.send(JSON.stringify(msg));
    }
	
	var requestRoomList = function(){
		sendToServer({type:"number_of_players"});
	}
	
	var joinRoom = function(roomid){
		sendToServer({type:"join", roomID:roomid});
	}
	
}