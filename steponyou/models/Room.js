var MAX_NO_PLAYERS = 4;
var GameEngine = require('./GameEngine.js');

module.exports = function Room(rmID){
	this.roomID = rmID;
	this.gameEngine = new GameEngine('server');
	this.players = {};//index via playerid
	this.sockets = {};//index via playerid
	this.gameEngine.init(null);
	this.gameEngine.start();
	var that = this;
	this.states = [];
	this.inputHistory = [];
	this.playerLatency = [];
	this.playerLag = [];

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
		this.broadcast({type:"leave", status:"pass", id:playerID});

		delete this.players[playerID];
		delete this.sockets[playerID];
		//Remove player from game engine
		this.gameEngine.removePlayer(playerID);
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
			message["lag"] = this.playerLag[id];
			this.sockets[id].write(JSON.stringify(message));
		}
	};
	this.unicast = function(message, playerID){
		message["lag"] = this.playerLag[playerID];
		var socket = this.sockets[playerID];
		socket.write(JSON.stringify(message));
	};

	this.updatePlayer = function(playerID, message, timestamp){
		this.gameEngine.simulatePlayer(playerID, message, timestamp);
	};

	this.generateUpdateState = function(){
		var updatePack = this.gameEngine.generateUpdate();
		this.broadcast(updatePack);
		//prepare update
		setTimeout( function(){that.generateUpdateState()}, this.gameEngine.timePerFrame );

	}
	
	
	
	this.calculateLatency = function(pid, timestamp){
		var latency = (new Date).getTime() - timestamp;
		
		if(pid == null || pid == -1){
			//nothing
		} else if(this.playerLatency[pid] == null){
			this.playerLatency[pid] = latency;
		} else{
			var temp = latency * 0.7 + this.playerLatency[pid] * 0.3;
			this.playerLatency[pid] = temp;
		}
		calcLag();
	}
	
	var calcLag = function(){
		var maxLatency = getMaxLatency();
		for(pid in that.playerLatency){
			if(that.playerLatency[pid] !== maxLatency){
				that.playerLag[pid] = maxLatency - that.playerLatency[pid];
			}
			else{
				that.playerLag[pid] = 0;
			}
			//console.log("Lag of player " + pid + ": " + that.playerLag[pid]);
			//console.log("Latency of player " + pid + ": " + that.playerLatency[pid]);
		}
	}
	
	var getMaxLatency = function(){
		var max = 0;
		for(pid in that.playerLatency){
			if(that.playerLatency[pid] > max){
				max = that.playerLatency[pid];
			}
		}
		return max;
	}


}
