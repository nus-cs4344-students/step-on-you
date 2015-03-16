var MAX_NO_PLAYERS = 4;
module.exports = function Room(gameEngine, rmID){
	this.roomID = rmID;
	this.engine = gameEngine;
	this.players = {};//index via playerid
	this.sockets = {};//index via playerid
	
	this.addPlayer = function(player,conn){
		if(this.getCurrentNoOfPlayers() == MAX_NO_PLAYERS){
			return false;
		}
		this.players[player.id] = player;
		this.sockets[player.id] = conn;
		return true;		
	};
	this.removePlayer = function(playerID){
		delete this.players[playerID];
		delete this.sockets[playerID];
	};
	this.getCurrentNoOfPlayers = function(){
		return Object.keys(this.players).length;
	};
	this.getPlayer = function(playerID){
		return this.players[playerID];
	};
	this.getSockets = function(){
		return this.sockets;
	};
	
	this.getRoomID = function(){
		return this.roomID;;
	};
	this.broadcast = function(message){
		for (socket in this.sockets) {
			socket.write(JSON.stringify(msg));
		}
	};
	this.unicast = function(message, playerID){
		var socket = this.sockets[playerID];
		socket.write(JSON.stringify(message));
	}
}
