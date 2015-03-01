
function GameEngine(serverOrClient, canvasObj){

	var role = serverOrClient;

	var physics = new Physics();
	var numPlayers = 0;
	var playerID = 0;
	var canvas = canvasObj;
	var ctx = canvas.getContext("2d");
	var players = [];
	var playerObjs = [];

	//i shouldn't need this
	var playerSprites = [];
	var FPS = 60;
	var timePerFrame = 1000/FPS;



	//create a flat ground to use as map
	var createPlane = function(){
		var body = new Body();
		body.width = canvas.width;
		body.height = 20;
		body.x = 0;
		body.renderX = 0;
		body.y = canvas.height - body.height;
		body.renderY = canvas.height - body.height;
		body.isStatic = true;
		return body;
	}

	//create sides
	var createLeft = function(){
		var left = new Body();
		left.height = canvas.height;
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
		right.height = canvas.height;
		right.width = 20;
		right.x = canvas.width - 20;
		right.renderX = canvas.width-20;
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

	//for server to use
	this.addPlayer = function(newPlayerID){
		players.push( {id : newPlayerID, spawnPosition : 0 });
		var p = new Player(newPlayerID);
		playerObjs[newPlayerID] = p;
		physics.addPhysicalBody(p.getBody());
		//console.log(p);
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

		physics.step();
		debugRender();

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




}