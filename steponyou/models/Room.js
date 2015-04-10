var MAX_NO_PLAYERS = 4;
var GameEngine = require('./GameEngine.js');

module.exports = function Room(rmID){
	this.roomID = rmID;
	this.gameEngine = new GameEngine('server');
	this.players = {};//index via playerid
	this.sockets = {};//index via playerid
	this.gameEngine.init(null);
	//this.gameEngine.start();

	var that = this;

	this.states = [];
	this.inputHistory = [];
	this.maxStateHistory = 30;

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

		this.gameEngine.stop();
		var packet = {playerID:playerID, message:message, timeStamp:timestamp};
		var cIndex = -5;
		var eIndex = -5;
		//if first element
		if(this.inputHistory.length == 0 ){
			this.inputHistory.push(packet);
			cIndex = this.inputHistory.length - 1;
			eIndex = 0;
		}
		else if (this.inputHistory[this.inputHistory.length-1].timeStamp <= timestamp ) {
			this.inputHistory.push(packet);
			cIndex = this.inputHistory.length - 1;
			eIndex = this.states.length - 1;

		}
		else{
			//determine where to insert the new packet
			for(var i = 0; i < this.inputHistory.length; i++){
				if(this.inputHistory[i].timeStamp >= timestamp){
					cIndex = i;
					break;
				}
			}

			//insert the new packet
			this.inputHistory.splice(cIndex,0, packet );

			//determine index of engine
			//scan from the back
			for(var i = this.states.length-1; i > 0; i--){
				if(this.states[i].time <= timestamp){
					eIndex = i;
					break;
				}
			}


		}
			

		//now we have identified the engine to use and the starting point of the input to run from
		//this may be the last engine state and only 1 input to run

		if(this.states[eIndex] != null){
			this.gameEngine = this.states[eIndex].engine;
		}


		console.log(this.gameEngine);
		console.log("expected engine index: " + eIndex);

		var overwriteEIndex = eIndex + 1;
		var engineTime = 0;
		if(this.states[eIndex] == null){
			if(eIndex == 0)
				engineTime = (new Date()).getTime();
			else{
				console.log("you should not be seeing this...");
				console.log("expected engine index: " + eIndex);
				engineTime = this.states[eIndex-1] + this.gameEngine.timePerFrame;
			}
		}
		else{
			engineTime = this.states[eIndex].time;
		}
		//for all inputs to fastforward / run
		for(var i = cIndex; i < this.inputHistory.length; i++ ){

			var currentInput = this.inputHistory[i];
			var timeGap =  engineTime - currentInput.timeStamp;

			//number of times to fast forward the engine to closest time to run the input
			var numFFSteps = Math.floor( timeGap / this.gameEngine.timePerFrame );
			console.log("fastforward: " + numFFSteps);
			//"fastforward" the gameEngine by stepping
			for(var j = 0; j < numFFSteps; j++){
				engineTime += this.gameEngine.timePerFrame;
				this.stepEngine(overwriteEIndex++, engineTime);
			}
			//run the simulation for the player
			this.gameEngine.simulatePlayer(packet.playerID, packet.message, packet.timestamp);
			engineTime += this.gameEngine.timePerFrame;
			console.log("tadah");
			console.log(this.gameEngine);
			this.stepEngine(overwriteEIndex++, engineTime);
		}

		//this.gameEngine.simulatePlayer(playerID, message, timestamp);
	};

	var runEngine = false;

	//save game engine states AFTER simulation to be sure that no more player inputs exist at that time
	//replaceIndex is the index to override if needed
	this.stepEngine = function(replaceIndex, overrideTime){
		console.log(this.gameEngine);
		this.gameEngine.step();
		if(overrideTime == null){
			overrideTime = (new Date()).getTime();
		}
		var state = {engine:this.gameEngine, time: overrideTime};
		if(replaceIndex == null){
			this.states.push(state);
			if(this.states.length > this.maxStateHistory ){
				this.states.shift();
			}
		}
		else{
			if(this.states.length > replaceIndex || (this.states.length == this.maxStateHistory && replaceIndex < this.maxStateHistory)){
				this.states[replaceIndex] = state;
			}
			else{
				console.log("You should not be seeing this message");
				console.log("replaceIndex: " + replaceIndex + "  states size: " + this.states.length);
				console.log("Attempting recovery methods - may fail");
				this.states.push(state);
			}

		}
	}

	var loopEngine = function(){
		if(runEngine){
			this.stepEngine();
			setTimeout(function(){loopEngine();}, this.gameEngine.timePerFrame);
		}
	}

	var stopLoopEngine = function(){
		runEngine = false;
	}

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
			console.log("Lag, latency of player " + pid + ": " + that.playerLag[pid] + " , " + that.playerLatency[pid]);
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
