var MAX_NO_PLAYERS = 4;
module.exports = function Room(gameEngine, rmID){
	this.roomID = rmID;
	this.engine = gameEngine;
	this.players = {};
	this.sockets = {};
	
	this.addPlayer = function(player,conn){
		if(this.players == MAX_NO_PLAYERS){
			return false;
		}
		this.players[conn.id] = player;
		sockets[conn.id] = conn;
		return true;		
	};
	this.removePlayer = function(playerID){
		delete this.players[playerID];
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
	}
}
