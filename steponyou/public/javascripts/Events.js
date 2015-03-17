var onRoomButtonClick = function(roomId) {
	var currentRoomId = lobbyManager.roomId;
	if (currentRoomId == -1 && roomId > -1) {
		lobbyManager.joinRoom(roomId);
	} else if (currentRoomId > -1 && currentRoomId == roomId) {
		lobbyManager.leaveRoom();
	}
}