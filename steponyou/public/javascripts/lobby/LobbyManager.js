function LobbyManager () {
	this.roomId = -1;
	this.playerId = -1;
	this.numberOfRoom = -1;
	this.rooms = {};
	this.serviceHelper = new ServiceHelper();
	this.serviceHelper.initNetwork();
}

LobbyManager.prototype.getRooms = function () {
	this.rooms = this.serviceHelper.requestRoomList();
}

LobbyManager.prototype.joinRoom = function (roomId) {
	this.serviceHelper.joinRoom(roomId);
}

LobbyManager.prototype.setRoom = function(roomId) {
	this.roomId = roomId;
	//update UI
	if (roomId > -1) {

	}
}

LobbyManager.prototype.updateRoomList = function(rooms) {
	this.rooms = rooms;
	//update UI
	if (rooms != null) {
		document.getElementById("roomStatus1").textContent=rooms[0] + "/4";
		document.getElementById("roomStatus2").textContent=rooms[1] + "/4";
	}
}

var joinRoom = function(roomId) {
	lobbyManager.joinRoom(roomId);
}