var MAX_NO_PLAYERS = 4;
var GameEngine = require('./GameEngine.js');

module.exports = function Room(rmID){
	this.roomID = rmID;
	this.gameEngine = new GameEngine('server');
	this.players = {};//index via playerid
	this.sockets = {};//index via playerid
	this.gameEngine.start();
	var that = this;
	this.addPlayer = function(player,conn){
		if(this.getCurrentNoOfPlayers() == MAX_NO_PLAYERS){
			return false;
		}
		this.players[player.id] = player;
		this.sockets[player.id] = conn;

		//Add new player to game engine
		this.gameEngine.addPlayer(player.id);
		return true;		
	};
	this.removePlayer = function(playerID){
		delete this.players[playerID];
		delete this.sockets[playerID];
		//Remove player from game engine
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
		return this.roomID;
	};
	this.broadcast = function(message){
		for (id in this.sockets) {
			this.sockets[id].write(JSON.stringify(message));
		}
	};
	this.unicast = function(message, playerID){
		var socket = this.sockets[playerID];
		socket.write(JSON.stringify(message));
	};

	this.updatePlayer = function(playerID, message){
		this.engine.simulatePlayer(playerID, message);
	};

	this.generateUpdateState = function(){
		var updatePack = this.gameEngine.generateUpdate();
		this.broadcast(updatePack);
		//prepare update
		setTimeout( function(){that.generateUpdateState()}, this.gameEngine.timePerFrame );
	}


}
