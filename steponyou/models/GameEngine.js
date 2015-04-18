var Physics = require("./Physics.js");
var Player = require("./Player.js");
var Body = require("./Body.js");

module.exports = 
function GameEngine(serverOrClient){

	this.role = serverOrClient;
	var that = this;
	var physics = new Physics(that);
	var playerID = 0;
	//var canvas = canvasObj;
	//var ctx = canvas.getContext("2d");
	var players = [];
	var playerObjs = [];
	var playerSprites = [];

	var bodyToPlayerID = [];

	var playerSprites = [];
	var playerScores = [];

	var thisPlayerID = 0;

	var FPS = 30;
	this.timePerFrame = 1000/FPS;

	var currentFrameNumber = 0;
	//stores the physics engine, index is frame number


	var that = this;

	//to do : better input handling
	//respawn point generation

	var keyMap = [];

	var map = [];
	var run = false;

	var startTime = 0;
	var currentTime = 0;
	var maxTime = 0;

	var historySize = 0.5 * FPS;
	var maxBacklogTime = Math.floor(historySize * this.timePerFrame)
	var inputHistory = [];
	var stateHistory = [];

	var useRewind = false;

	this.setPlayerSprite= function(pid, spriteName){
		playerSprites[pid] = spriteName;
	}


	this.changeFPS = function(fp){
		FPS = fp;
		this.timePerFrame = 1000/FPS;
	}

	var generateMap = function(mapWidth,mapHeight){
		var offset = 20;
		//define borders
		//ground
		map.push( { x:-100, y:mapHeight-offset, width:mapWidth+100, height:offset, permissible:false } );
		//ceiling
		map.push( { x:-100, y:0, width:mapWidth+100, height:10, permissible:false  } );
		//left
		map.push({x:0, y:-100, width:offset, height:mapHeight+100, permissible:false});
		//right
		map.push({x:mapWidth-offset, y:-100, width:offset, height:mapHeight+100, permissible:false});

		//floating platforms
		map.push({x:200, y:420, width:100, height:20, permissible:true});
		map.push({x:320, y:320, width:200, height:20, permissible:true});
		map.push({x:500, y:420, width:180, height:20, permissible:true});
		map.push({x:700, y:220, width:80, height:20, permissible:true});

		map.push({x:20, y:180, width:150, height:20, permissible:true});

	}


	//hard coded for now
	var generateFloatingPlatforms = function(){
		return {x:200, y:420, width:100, height:20, permissible:true};
	}

	var installMap = function(){
		for(var i = 0; i < map.length; i++){
			installPlatform(map[i]);
		}
	}

	var installPlatform = function(plane){
		var p = createPlatform(plane.x, plane.y, plane.width, plane.height, plane.permissible);
		physics.addStaticBody(p);
	}

	this.getMap = function(){
		return map;
	}

	var createPlatform = function(x,y,w,h,permissible){
		var f = new Body();
		f.height = h;
		f.width = w;
		f.x = x;
		f.y = y;
		f.renderX = f.x;
		f.renderY = f.y;
		f.isStatic = true;
		f.setPermissible(permissible);
		//console.log("created platform at: " + f.x + ", " + f.y + " width: " + f.width + " height: " + f.height);
		return f;
	}

	//load / create map
	//dummy function for now
	var loadMap = function(){
		console.log("loading map");
		/*
		var ground = new createPlane();
		var l = createLeft();
		var r = createRight();
		var f = createFloat();

		physics.addStaticBody(ground);
		physics.addStaticBody(l);
		physics.addStaticBody(r);
		physics.addStaticBody(f);
		*/
		generateMap(800,600);
		console.log("generated map");
		installMap();
		console.log("installed map");
	}



	this.registerKeys = function(keys){
		keyMap = keys;
	}

	this.getPlayerPosition = function(pid){

		if(!playerObjs[pid] == null)
			return playerObjs[pid].getPosition();
		return -10;
	}


	//need function to simulate keys for other players
	this.simulatePlayer = function(playerID, playerEvent, timestamp){

		var thatPlayer = playerObjs[playerID];
		var pos = playerEvent.pos;
		var keysPressed = playerEvent.keyMap;

		var packet = {playerID:playerID, playerEvent:playerEvent, timeStamp:timestamp};
		var cIndex = -5;
		var eIndex = -5;

		if(this.role == 'server'){

			//if player is dead, reject input
			if(!playerObjs[playerID].getBody().isAlive()){
				return;
			}
			else{
				//re-sync player position before running input
				playerObjs[playerID].setPosition(pos.x, pos.y);
			}

			if(useRewind){

				//inputHistory.push({timestamp:timestamp, playerID:playerID, playerEvent:playerEvent});

				//if first element
				if(inputHistory.length == 0 ){
					inputHistory.push(packet);
					cIndex = 0;
				}
				else if (inputHistory[inputHistory.length-1].timeStamp <= timestamp ) {
					inputHistory.push(packet);
					cIndex = inputHistory.length - 1;
				}
				else{
					//determine where to insert the new packet
					for(var i = 0; i < inputHistory.length; i++){
						if(inputHistory[i].timeStamp >= timestamp){
							cIndex = i;
							break;
						}
					}

					//insert the new packet
					inputHistory.splice(cIndex,0, packet );
				}

				//determine index of engine
				//scan from the back
				for(var i = stateHistory.length-1; i > 0; i--){
					if(stateHistory[i].time <= timestamp){
						eIndex = i;
						break;
					}
				}



			}
		}

		if(keysPressed[40] == true && (keysPressed[32] == true || keysPressed[38] == true)){
	        //console.log("down + jump");
	        thatPlayer.fallThrough();
	    }

		else if(keysPressed[37] == true && (keysPressed[32] == true || keysPressed[38] == true)){
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

	    
	   if(keysPressed[39] == false && keysPressed[37] == false){
	    	//console.log("uhh");
	    	//console.log("left: " + keysPressed[37] + " right: " + keysPressed[39]);
	    	thatPlayer.removeAccelerationX();
	    }
	    

	}

	this.registerCurrentPlayer = function(playerID){
		player = playerObjs[playerID];
		thisPlayerID = playerID;
		//console.log("playerID: " + playerID);
	}

	this.getCurrentPlayer = function(){
		return playerObjs[thisPlayerID];
	}

	//deprecated
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

		body.renderY = 500;
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

	var createFloat = function(){
		var f = new Body();
		f.height = 10;
		f.width = 100;
		f.x = 200;
		f.y = 500 - 150;
		f.renderX = f.x;
		f.renderY = f.y;
		f.isStatic = true;
		f.setPermissible(true);
		return f;
	}

	//generate spawnPosition

	this.addPlayer = function(newPlayerID){
		players.push( {id : newPlayerID, spawnPosition : 0 });
		var p = new Player(newPlayerID);
		playerObjs[newPlayerID] = p;
		physics.addPhysicalBody(p.getBody());
		//console.log(p);

		//p.setPosition( (Math.random() * 100 + 20) % 800, (Math.random() * 100 + 20) % 600);
		//p.setPosition( 400, 450);

		var pos = generateRespawnPos();
		p.setPosition(pos.x, pos.y);

    	p.faceLeft();
    	p.setDefaultVec();
		bodyToPlayerID[p.getBody().objectID] = newPlayerID;

		//initialize player score
		playerScores[newPlayerID] = 0;

		return p;
	}

	this.removePlayer = function(playerID){
		var bid = playerObjs[playerID].getBody().objectID;
		physics.removePhysicalBody(bid);

		delete bodyToPlayerID[bid];
		delete playerObjs[playerID];


	}

	this.init = function(dataFromServer){

		//map
		loadMap();
		//players

	}

	this.start = function(st){
		run = true;
		startTime = st;
		currentTime = startTime;
		maxTime = currentTime;
		gameLoop();
	}

	this.stop  = function(){
		run = false;
	}

	var gameLoop = function(){

		if(!run){
			return;
		}

		/*
		currentFrameNumber++;
		physics.step();
		*/
		step();

		//debugRender();

		setTimeout( function(){gameLoop()}, that.timePerFrame );

	}

	this.step = function(){
		currentFrameNumber++;
		physics.step();
	}

	var step = function(overrideIndex){
		currentFrameNumber++;
		physics.step();

		if(!useRewind){
			return;
		}

		currentTime += this.timePerFrame;

		if(overrideIndex == null){
			stateHistory.push({time:currentTime, state: clone(physics)});
		}
		else{

			if(overrideIndex >= stateHistory.length){
				console.log("ge - you should be seeing this...attempting recovery methods");
				console.log(overrideIndex + " index requested but size is " + stateHistory.length);
				stateHistory.push({time:currentTime, state: clone(physics)});	
			}
			else{
				stateHistory[i] = {time:currentTime, state: clone(physics)};
			}

		}

		//keep history size in check
		while(stateHistory.length > historySize){
			stateHistory.shift();
		}
		//keep inputHistory size in check
		//clean up inputHistory
		//find last allowed index
		var lastAllowedIndex = -1;
		for(var i = 0; i < inputHistory.length; i++){
			if(currentTime - inputHistory[i].timestamp <= maxBacklogTime){
				lastAllowedIndex = i;
				break;
			}
		}

		//only need to clean if lastAllowedIndex >= 0
		if(lastAllowedIndex > 0){
			inputHistory = inputHistory.splice(0,lastAllowedIndex);
		}


	}

	var clone = function(jsonObject){
		mObj=JSON.parse(JSON.stringify(jsonObject));
		return mObj;
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

		playerScores[bodyToPlayerID[playerBodyId]]++;

	}

	this.AkilledB = function(aBodyId,bBodyId){

		if(bodyToPlayerID[bBodyId] == null || bodyToPlayerID[aBodyId] == null){
			return;
		}
		
		//console.log(aBodyId + ", " + bBodyId );
		addPlayerScore(aBodyId);;
		playerObjs[bodyToPlayerID[bBodyId]].setPosition(500,1000);
		//console.log(bodyToPlayerID[aBodyId] + " killed " + bodyToPlayerID[bBodyId]);
		//console.log("scheduled reviving player");

		this.revivePlayerIn(bBodyId, 2000);
	}

	var generateRespawnPos = function(){
		var x = 20 + (Math.random() * 680);
		var y = (500 + Math.random() *  20) ;
		return {x: x, y: y};
	}

	var revivePlayer = function(bodyId){

		var pid = bodyToPlayerID[bodyId];

		if(pid == null || playerObjs[pid] == null){
			//console.log("aborting revive, this player is already not in the room");
			return;
		}
		var pos = generateRespawnPos();

		if(pos.x > 730)
			pos.x = 730;
		if(pos.y > 530)
			pos.y = 530;

		playerObjs[pid].getBody().revive(pos.x, pos.y);
		playerObjs[pid].setPosition(pos.x, pos.y);
		console.log("revived player  at " + pos.x + ", " + pos.y);


	}

	this.revivePlayerIn = function(bodyId, time){
		setTimeout( function(){revivePlayer(bodyId);}, time);
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
		var charSprite;

		if(bodyToPlayerID[obj.objectID] == null || playerSprites[bodyToPlayerID[obj.objectID]] == null){

			switch( bodyToPlayerID[obj.objectID] % 4 ){
				case 0: 
					charSprite = "devil";
					break;
				case 1:
					charSprite = "angel";
					break;
				case 2:
					charSprite = "green";
					break;
				case 3:
					charSprite = "white";
					break;
				default: 
					charSprite = "devil";
					break;
			}

		}
		else{
			charSprite = playerSprites[bodyToPlayerID[obj.objectID]];
		}


		var pPack = {
			updateType : "update",
			id : bodyToPlayerID[obj.objectID],
			x : obj.renderX,
			y : obj.renderY,
			character : charSprite,
			status: "moving",
			isAlive: obj.isAlive(),
			score: playerScores[bodyToPlayerID[obj.objectID]],
			direction : obj.orientation


		}



		return pPack;

	}


	this.generateUpdate = function(){

		var update = {
			type: "update",
		    packageType: "update",
		    objects: []

		};

		var physicObjects = physics.getPhysicObjects();
		for(var i = 0; i < physicObjects.length; i++){

			if(physicObjects[i] == undefined){
				continue;
			}


			obj = physicObjects[i];

			if(this.role == 'client'){
				if(obj.isAlive())
					update.objects.push(generatePlayerUpdatePacket(obj));
			}
			else if(this.role == 'server'){
				update.objects.push(generatePlayerUpdatePacket(obj));
			}
	
			//console.log("x : " + obj.renderX + ", y : " + obj.renderY + ", w: " + obj.width + ", h: " + obj.height);

		}

		//console.log(update);

		return update;

	}

	this.processUpdate = function(msg){

		//console.log("GameEngine : process update");
		//console.log(msg);
		var playersData = msg.objects;

		if(msg.objects == null){
			console.log("null msg from server received");
			return;
		}

		//console.log(playersData);
		if(this.role == 'client'){
			for(var i = 0; i < playersData.length; i++){
				//update all players that are not this player
				var pMsg = playersData[i];
				
				//update score from server
				playerScores[pMsg.id] = pMsg.score;

				if(pMsg.id != thisPlayerID){

					//if other player does exist (null or undefined), add and create
					if(playerObjs[pMsg.id] == null){
						this.addPlayer(pMsg.id);
					}

					//set other player's position
					playerObjs[pMsg.id].setPosition( pMsg.x, pMsg.y );
					
					
				}
				//else if it this this player
				else{
					//check for switch from alive to dead
					if(playerObjs[pMsg.id].getBody().isAlive() == true && pMsg.isAlive == false){
						console.log("you are dead, " + pMsg.x + ", " + pMsg.y);
						playerObjs[pMsg.id].getBody().setDead();
						playerObjs[pMsg.id].setPosition(pMsg.x, pMsg.y);	
					}
					//check for switch from dead to alive
					else if(playerObjs[pMsg.id].getBody().isAlive() == false && pMsg.isAlive == true){
						console.log("reviving at: " + pMsg.x + ", " + pMsg.y);
						playerObjs[pMsg.id].getBody().revive(pMsg.x, pMsg.y);
						playerObjs[pMsg.id].setPosition(pMsg.x, pMsg.y);
					}
				}
			}
		}
		//for server
		else{

			for(var i = 0; i < playersData.length; i++){
			//update all players that are not this player
				var pMsg = playersData[i];

				//if other player does exist (null or undefined), add and create
				if(playerObjs[pMsg.id] == null){
					this.addPlayer(pMsg.id);
				}

				//set position if alive
				if(playerObjs[pMsg.id].getBody().isAlive()){
					playerObjs[pMsg.id].setPosition( pMsg.x, pMsg.y );
				}

			}
		}
		
		
	}
	
}