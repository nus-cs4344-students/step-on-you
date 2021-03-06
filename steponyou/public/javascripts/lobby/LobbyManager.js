function LobbyManager () {
	that = this;
	this.roomId = -1;
	this.playerId = -1;

	var rooms = {};
	var pendingRoomId = -1;
	var isRoomReady = false;
	var serviceHelper = new ServiceHelper();
	var callbackGameEngine;
	
	this.localLag = 0;
	
	
	//public methods
	this.getRooms = function () {
		serviceHelper.requestRoomList();
	}

	this.joinRoom = function (roomId) {
		if (isRoomReady && this.playerId > -1 && this.roomId == -1) {
			pendingRoomId = roomId;
			serviceHelper.joinRoom(roomId, this.playerId);
		} else {
			alert("Canot join room");
			console.log("LOBBY: cannot join room")
		}
	}

	this.leaveRoom = function () {
		if (isRoomReady && this.playerId > -1 && this.roomId > -1) {
			serviceHelper.leaveRoom(this.playerId);
			pendingRoomId = -1;
		} else {
			console.log("LOBBY: cannot join room");
		}
	}

	//private helper methods
	this.onNetworkEvent = function(eventType, data) {
		// if(data !== null && data.lag !== 'undefined'){
			//console.log("Current local lag: " + data.lag);
			// this.localLag = data.lag;
		// }
		if (eventType == 'connection_ready') {
			console.log("LOBBY: connection ready");
			//querry room status every 0.1 sec
			setInterval(function () {that.getRooms()}, 1000);
			this.getPlayerId();
			syncClocks();
		} else if (eventType == 'roomList') {
			this.updateRooms(data);
			isRoomReady = true;
		} else if (eventType == 'joinRoom') {
			console.log("LOBBY: on join room result");
			this.setRoom(data.status);
		} else if (eventType == 'leave') {
			console.log("LOBBY: on leave room result");
			this.setRoom(data.status);
		} else if (eventType == 'new_player') {
			console.log("LOBBY: on player id assigned");
			this.setPlayerId(data.id);
		} else if (eventType == "update"){
			this.localLag = data.lag;
			//console.log("lobbymanager lag: " + this.localLag);
			//console.log("LOBBY: Recevied update on players");
		}
	}

	this.updateRooms = function(rooms) {
		this.rooms = rooms;
		if (rooms != null) {
			document.getElementById("roomStatus1").textContent=rooms[0] + "/4";
			document.getElementById("roomStatus2").textContent=rooms[1] + "/4";
			document.getElementById("roomStatus3").textContent=rooms[2] + "/4";
			document.getElementById("roomStatus4").textContent=rooms[3] + "/4";
		}
	}

	this.setRoom = function(status) {
		if (pendingRoomId > -1 && status == 'pass') {
			console.log("LOBBY: Join room successfully " + pendingRoomId);
			this.roomId = pendingRoomId;
			pendingRoomId = -1;
			callbackGameEngine(this.playerId);
			var roomName = "buttonRoom" + this.roomId;
			document.getElementById(roomName).textContent = "LEAVE ROOM";

			//update backgrd music
			document.getElementById('audio_backgroundOutgame').pause();
			document.getElementById('audio_backgroundIngame').play();
			document.getElementById('audio_backgroundIngame').volume = 0.3;
		} else if (pendingRoomId == -1 && status == 'pass') {
			console.log("LOBBY: Leave Room successfully");
			var roomName = "buttonRoom" + this.roomId;
			document.getElementById(roomName).textContent = "JOIN ROOM";
			this.roomId = -1;
			visualizer.reset();

			//update backgrd music
			document.getElementById('audio_backgroundIngame').pause();
			document.getElementById('audio_backgroundIngame').currentTime = 0;
			document.getElementById('audio_backgroundOutgame').play();
		}
	}

	this.getPlayerId = function() {
		serviceHelper.requestId(this.playerId);
	}

	this.setPlayerId = function (id) {
		this.playerId = id;
	}

	this.startConnection = function(callback) {
		callbackGameEngine = callback;
		serviceHelper.initNetwork(function(eventType, data) {
			that.onNetworkEvent(eventType, data);
		});
	}
	
	this.sendEvent = function(pid, KP){
		serviceHelper.sendMove(pid, KP);
	}
	
	var syncClocks = function(){
		serviceHelper.syncClocks();
		setTimeout(function(){ syncClocks() }, 5000); //resync every 5 sec
	}
}