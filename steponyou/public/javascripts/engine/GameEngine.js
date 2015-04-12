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

	var playerScores = [];

	this.thisPlayerID = 0;
	this.isPlaying = false;
	var FPS = 60;
	this.timePerFrame = 1000/FPS;

	var currentFrameNumber = 0;
	//stores the physics engine, index is frame number


	var that = this;

	//to do : better input handling
	//respawn point generation

	var keyMap = [];

	var map = [];
	var run = false;

	this.setPlayerSprite= function(pid, spriteName){
		playerSprites[pid] = spriteName;
	}

	this.getCurrentPlayerStatus = function(){
		return playerObjs[this.thisPlayerID].getBody().isAlive();
	}


	var generateMap = function(mapWidth,mapHeight){
		var offset = 20;
		//define borders
		//ground
		map.push( { x:0, y:mapHeight-offset, width:mapWidth, height:offset, permissible:false } );
		//ceiling
		map.push( { x:0, y:0, width:offset, height:offset, permissible:false  } );
		//left
		map.push({x:0, y:0, width:offset, height:mapHeight, permissible:false});
		//right
		map.push({x:mapWidth-offset, y:0, width:offset, height:mapHeight, permissible:false});

		//floating platforms
		map.push({x:200, y:420, width:100, height:20, permissible:true});
		map.push({x:320, y:320, width:300, height:20, permissible:true});
		map.push({x:500, y:420, width:180, height:20, permissible:true});
		map.push({x:700, y:220, width:100, height:20, permissible:true});


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
		console.log("created platform at: " + f.x + ", " + f.y + " width: " + f.width + " height: " + f.height);
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

	this.registerKeys = function(keys){
		keyMap = keys;
	}

	this.getPlayerPosition = function(pid){

		if(!playerObjs[pid] == null)
			return playerObjs[pid].getPosition();
		return -10;
	}


		//need function to simulate keys for other players
	this.simulatePlayer = function(playerID, playerEvent, frameNumber){
		
		if (!this.isPlaying)
			return;

		var thatPlayer = playerObjs[playerID];

		var keysPressed = playerEvent.keyMap;
		if(this.role == 'server'){
			var pos = playerEvent.pos;
			thatPlayer.setPosition(pos.x, pos.y);
		}

		if(keysPressed[40] == true && (keysPressed[32] == true || keysPressed[38] == true)){
	        console.log("down + jump");
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

	    else if(keysPressed[40] == true && (keysPressed[32] == true || keysPressed[38] == true)){
	        console.log("down + jump");
	        thatPlayer.fallThrough();
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
		this.isPlaying = true;
		player = playerObjs[playerID];
		this.thisPlayerID = playerID;
		
	}

	this.getCurrentPlayer = function(){
		return playerObjs[this.thisPlayerID];
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
		if(playerID == this.thisPlayerID){
			this.thisPlayerID = 0;
			this.isPlaying = false;
		}
		var bid = playerObjs[playerID].getBody().objectID;
		physics.removePhysicalBody(bid);

		delete bodyToPlayerID[bid];
		delete playerObjs[playerID];

		var update = {
			type: "update",
	    	packageType: "update",
	    	objects: []

		};

		removePack = {
			updateType : "remove",
			id : playerID
		};
		update.objects.push(removePack);
		visualizer.update(update);
			
	}

	this.init = function(dataFromServer){
		console.log("initializing");
		//map
		loadMap();
		//players

	}

	this.start = function(){
		run = true;
		gameLoop();
	}

	
	this.stop  = function(){
		run = false;
	}

	var gameLoop = function(){

		if(!run){
			return;
		}

		currentFrameNumber++;
		if(that.thisPlayerID != 0){
			physics.step();
		}
		//debugRender();
		setTimeout( function(){gameLoop()}, that.timePerFrame );

	}

	this.step = function(){
		currentFrameNumber++;
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

	var retrieveMapData = function(){
		return map;
	}

	var addPlayerScore = function(playerBodyId){

		playerScores[bodyToPlayerID[playerBodyId]]++;

	}

	this.AkilledB = function(aBodyId,bBodyId){
		console.log(aBodyId + ", " + bBodyId );
		addPlayerScore(aBodyId);;
		playerObjs[bodyToPlayerID[bBodyId]].setPosition(1000,1000);
		console.log(bodyToPlayerID[aBodyId] + " killed " + bodyToPlayerID[bBodyId]);
		console.log("scheduled reviving player");

		this.revivePlayerIn(bBodyId, 5000);
	}

	var generateRespawnPos = function(){
		var x = 20 + (Math.random() * 780);
		var y = (430 + Math.random() *  100) ;
		return {x: x, y: y};
	}

	var revivePlayer = function(bodyId){

		var pid = bodyToPlayerID[bodyId];
		var pos = generateRespawnPos();
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
				case 3:
					charSprite = "green";
					break;
				case 4:
					charSprite = "white";
				default: 
					charSprite = "devil";
					break;
			}

		}
		else{
			charSprite = playerSprites[bodyToPlayerID[obj.objectID]];
		}

		var local = (bodyToPlayerID[obj.objectID] == this.thisPlayerID);
		

		var pPack = {
			updateType : "update",
			id : bodyToPlayerID[obj.objectID],
			x : obj.renderX,
			y : obj.renderY,
			character : charSprite,
			status: "moving",
			isAlive: obj.isAlive(),
			score: playerScores[bodyToPlayerID[obj.objectID]],
			direction : obj.orientation,
			isLocal: local

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

				if(pMsg.id != this.thisPlayerID){

					//if other player does exist (null or undefined), add and create
					if(playerObjs[pMsg.id] == null){
						this.addPlayer(pMsg.id);
					}

					//set other player's position
					var playerPositionX = playerObjs[pMsg.id].getPosition().x;
					var playerPositionY = playerObjs[pMsg.id].getPosition().y;
					var difference = (Math.abs(playerPositionX - pMsg.x) + Math.abs(playerPositionY - pMsg.y));
					//Doing convergence if difference is > 5.0
					if(difference > 5.0){
						// console.log(difference);
						var newX = playerPositionX;
						var newY = playerPositionY;
						for(var i=0; i < 20; i++){
							var newX = newX + (pMsg.x - playerPositionX)/20.0;
							var newY = newY + (pMsg.y - playerPositionY)/20.0;
							playerObjs[pMsg.id].setPosition( newX, newY );
						}
						var diffX = playerObjs[pMsg.id].getPosition().x - pMsg.x;
						var diffY = playerObjs[pMsg.id].getPosition().y - pMsg.y;
						if(diffX > 0.000001 || diffY > 0.000001){
							console.log(diffX);
							console.log(diffY);
						}
					}else{
						playerObjs[pMsg.id].setPosition( pMsg.x, pMsg.y );
					}
					
					
				}
				//else if it this this player
				else{

					//console.log("server thinks player is at: " + pMsg.x + ", " + pMsg.y);
					//console.log("player is actually at: " + playerObjs[pMsg.id].getBody().renderX + ", " + playerObjs[pMsg.id].getBody().renderY);

					//check for switch from alive to dead
					if(playerObjs[pMsg.id].getBody().isAlive() == true && pMsg.isAlive == false){
						console.log("you are dead, " + pMsg.x + ", " + pMsg.y);
						playerObjs[pMsg.id].getBody().setDead();
						playerObjs[pMsg.id].setPosition(pMsg.x, pMsg.y);

						var update = {
							type: "update",
					    	packageType: "update",
					    	objects: []

						};

						removePack = {
							updateType : "remove",
							id : pMsg.id
						};
						update.objects.push(removePack);
						visualizer.update(update);

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