function LobbyManager () {
	that = this;
	this.roomId = -1;
	this.playerId = -1;
LobbyManager.prototype.getPID = function () {
	return this.serviceHelper.getPID();
}
	var rooms = {};
	var isRoomReady = false;
	var serviceHelper = new ServiceHelper();
	
	//public methods
	this.getRooms = function () {
		serviceHelper.requestRoomList();
		isRoomReady = false;
	}

	this.joinRoom = function (roomId) {
		if (isRoomReady) {
			serviceHelper.joinRoom(roomId);
		} else {
			console.log("Rooms are not ready")
		}
	}

	//private helper methods
	this.onNetworkEvent = function(eventType, data) {
		if (eventType == 'connection_ready') {
			this.getRooms();
			this.getPlayerId();
		} else if (eventType == 'updateRooms') {
			this.updateRooms(data);
		} else if (eventType == 'setRoom') {
			this.setRoom(data);
		} else if (eventType == 'new_player') {
			this.this.setPlayerId(data.playerID);
		}
	}

	this.updateRooms = function(rooms) {
		this.rooms = rooms;
		if (rooms != null && rooms.size >= 2) {
			document.getElementById("roomStatus1").textContent=rooms[0] + "/4";
			document.getElementById("roomStatus2").textContent=rooms[1] + "/4";
		}
	}

	this.setRoom = function(id, isSuccess) {
		this.roomId = roomId;
		if (roomId > -1 && isSuccess) {
			this.roomId = roomId;
			isRoomReady = true;
		}
	}

	this.getPlayerId = function() {
		serviceHelper.requestId(this.playerId);
	}

	this.setPlayerId = function (id) {
		this.playerId = id;
	}


	serviceHelper.initNetwork(function(eventType, data) {
		that.onNetworkEvent(eventType, data);
	});
}