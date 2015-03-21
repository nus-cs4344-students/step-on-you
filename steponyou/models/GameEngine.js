var Physics = require("./Physics.js");
var Player = require("./Player.js");

module.exports = function GameEngine(serverOrClient){

	var role = serverOrClient;
	var that = this;
	var physics = new Physics(that);
	var numPlayers = 0;
	var playerID = 0;
	//var canvas = canvasObj;
	//var ctx = canvas.getContext("2d");
	var players = [];
	var playerObjs = [];

	var bodyToPlayerID = [];

	var playerSprites = [];
	var playerScores = [];

	var thisPlayerID = 0;

	var FPS = 60;
	var timePerFrame = 1000/FPS;

	var currentFrameNumber = 0;
	//stores the physics engine, index is frame number
	var stateRecords = [];
	//how far back to keep states of, in seconds
	var recordTime = 8;
	var garbageCollectionInterval = 5000; // 5 seconds
	//keep about 5 seconds?
	//1 record per frame
	var maxNumStateRecords =  recordTime * FPS;
	var lastDeletionPoint = 0;

		//to do : better input handling
	//respawn point generation

	var keyMap = [];

	this.registerKeys = function(keys){
		keyMap = keys;
	}

	var saveState = function(){
		stateRecords[currentFrameNumber] = physics;
	}

	var rewindAndEmulate = function(){
		
	}

	//function to clean-up states that are too old
	var garbageCollection = function(){
		var deletonStart = lastDeletionPoint;
		var deletionEnd = currentFrameNumber - maxNumStateRecords;

		for(var i = deletonStart; i < deletionEnd; i++){
			delete stateRecords[i];
		}

		lastDeletionPoint = deletionEnd;
		setTimeout( function(){(garbageCollection);}, garbageCollectionInterval);
	}


		//need function to simulate keys for other players
	this.simulatePlayer = function(playerID, keysPressed){

		var thatPlayer = playerObjs[playerID];


		if(keysPressed[37] != null && keysPressed[37] == true && (keysPressed[32] == true || keysPressed[38] == true)){
	        //console.log("left + jump");
	        thatPlayer.moveLeft();
	        thatPlayer.jump();
	    }

	    else if(keysPressed[39] == true && (keysPressed[32] == true || keysPressed[38] == true)){
	        //console.log("right + jump");
	        thatPlayer.moveRight();
	        thatPlayer.jump();
	    }


	    else if(keysPressed[37] == true) {
	        //left
	        //console.log(thatPlayer1.m_body);
	        //console.log("left");
	       	thatPlayer.moveLeft();

	    }

	   else if(keysPressed[39] == true) {
	        //right
	         //console.log("right");
	         //gameEngine.step();
	         thatPlayer.moveRight();
	       
	    }
	    
	    else if(keysPressed[32] == true || keysPressed[38] == true) {

	         //console.log("jump");
	         thatPlayer.jump();     
	    }

	    
	   else if(keysPressed[39] == false && keysPressed[37] == false){
	    	//console.log("uhh");
	    	//console.log("left: " + keysPressed[37] + " right: " + keysPressed[39]);
	    	thatPlayer.removeAccelerationX();
	    }
	    

	}

	this.registerCurrentPlayer = function(playerID){
		player = playerObjs[playerID];
		thisPlayerID = playerID;
		console.log("playerID: " + playerID);
	}

	this.processInput = function(){

		if(keyMap[37] == true && (keyMap[32] == true || keyMap[38] == true)){
	        //console.log("left + jump");
	        player.moveLeft();
	        player.jump();
	    }

	    else if(keyMap[39] == true && (keyMap[32] == true || keyMap[38] == true)){
	        //console.log("right + jump");
	        player.moveRight();
	        player.jump();
	    }


	    else if(keyMap[37] == true) {
	        //left
	        //console.log(player1.m_body);
	       // console.log("left");
	       	player.moveLeft();

	    }

	   else if(keyMap[39] == true) {
	        //right
	         //console.log("right");
	         //gameEngine.step();
	         player.moveRight();
	       
	    }
	    
	    else if(keyMap[32] == true || keyMap[38] == true) {

	         //console.log("jump");
	         player.jump();     
	    }

	}

	//create a flat ground to use as map
	var createPlane = function(){
		var body = new Body();
		//body.width = canvas.width;
		body.width = 800;
		body.height = 20;
		body.x = 0;
		body.renderX = 0;
		
		//body.y = canvas.height - body.height;
		//body.renderY = canvas.height - body.height;

		body.renderY = 600 - 20;
		body.y = body.renderY;

		body.isStatic = true;
		return body;
	}

	//create sides
	var createLeft = function(){
		var left = new Body();
		//left.height = canvas.height;
		left.height = 600;
		left.width = 20;
		left.x = 0;
		left.renderX = 0;
		left.y = 0;
		left.renderY = 0;
		left.isStatic = true;

		return left;
	}

	var createRight = function(){
		var right = new Body();
		//right.height = canvas.height;
		right.height = 600;
		right.width = 20;
		//right.x = canvas.width - 20;
		//right.renderX = canvas.width-20;
		right.x = 800 - 20;
		right.renderX = 800 - 20;
		
		right.y = 0;
		right.renderY = 0;
		right.isStatic = true;

		return right;
	}

	//load / create map
	//dummy function for now
	var loadMap = function(){
		
		var ground = new createPlane();
		var l = createLeft();
		var r = createRight();
		physics.addStaticBody(ground);
		physics.addStaticBody(l);
		physics.addStaticBody(r);
	}

	//generate spawnPosition

	this.addPlayer = function(newPlayerID){
		players.push( {id : newPlayerID, spawnPosition : 0 });
		var p = new Player(newPlayerID);
		playerObjs[newPlayerID] = p;
		physics.addPhysicalBody(p.getBody());
		//console.log(p);

		p.setPosition( (Math.random() * 100 + 20) % 800, (Math.random() * 100 + 20) % 600);
    	p.faceLeft();

		bodyToPlayerID[p.getBody().objectID] = newPlayerID;



		return p;
	}

	this.init = function(dataFromServer){

		//map
		loadMap();
		//players

	}

	this.start = function(){
		gameLoop();
	}

	var gameLoop = function(){
		currentFrameNumber++;
		physics.step();
		//debugRender();
		setTimeout( function(){gameLoop()}, timePerFrame );

	}

	this.step = function(){
		physics.step();
	}

	var debugRender = function(){

		//clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);


		var obj;
		var staticObjects = physics.getStaticObjects();
		//render map
		for(var i = 0; i < staticObjects.length; i++){
			obj = staticObjects[i];

			ctx.fillStyle = "#0000FF";
			ctx.fillRect(obj.renderX, obj.renderY, obj.width, obj.height);
		}

		//render players
		var physicObjects = physics.getPhysicObjects();
		for(var i = 0; i < physicObjects.length; i++){
			obj = physicObjects[i];

			ctx.fillStyle = "#FF0000";
			ctx.fillRect(obj.renderX, obj.renderY, obj.width, obj.height);
			//console.log("x : " + obj.renderX + ", y : " + obj.renderY + ", w: " + obj.width + ", h: " + obj.height);
		}
	}

	var addPlayerScore = function(playerBodyId){

		playerScore[bodyToPlayerID[playerBodyId]]++;

	}

	


	var generatePlayerUpdatePacket = function(obj){
		/*		
		var pPack = [];
		pPack["updateType"] = "update";
		pPack["id"] = bodyToPlayerID[obj.objectID];
		pPack["x"] = obj.renderX;
		pPack["y"] = obj.renderY;
		pPack["character"] = "devil";
		pPack["status"] = "moving"
		pPack["direction"] = obj.orientation
		*/

		var pPack = {
			updateType : "update",
			id : bodyToPlayerID[obj.objectID],
			x : obj.renderX,
			y : obj.renderY,
			character : "devil",
			status: "moving",
			direction : obj.orientation


		}

		return pPack;

	}


	this.generateUpdate = function(){

		var update = {
			"type": "update",
		    "packageType": "update",
		    "objects": []

		};

		var physicObjects = physics.getPhysicObjects();
		for(var i = 0; i < physicObjects.length; i++){
			obj = physicObjects[i];
			update.objects.push(generatePlayerUpdatePacket(obj));
	
			//console.log("x : " + obj.renderX + ", y : " + obj.renderY + ", w: " + obj.width + ", h: " + obj.height);

		}

		//console.log("Game Engine created update: " + JSON.stringify(update));


		return update;

	}

	this.processUpdate = function(update){

		
		console.log("GameEngine : process update");
		console.log(update);
		var playersData = update.objects;

		//console.log(playersData[0]);
		/*
		for(var i = 0; i < playersData.length; i++){
			//update all players that are not this player
			var pMsg = playersData[i];
			if(playersData[i].id != thisPlayerID){
				playerObjs[playersData[i].id].setPosition( playersData[i].x, playersData[i].y );
			}
		}
		*/
	}
	
}