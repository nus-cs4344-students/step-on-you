
function GameEngine(serverOrClient, canvasObj){

	var role = serverOrClient;

	var physics = new Physics();
	var numPlayers = 0;
	var playerID = 0;
	var canvas = canvasObj;
	var ctx = canvas.getContext("2d");
	var players = [];

	//i shouldn't need this
	var playerSprites = [];
	var FPS = 30;
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
		return body;
	}
	//load / create map
	//dummy function for now
	var loadMap = function(){
		
		var ground = new createPlane();
		physics.addStaticBody(ground);
	}

	//generate spawnPosition

	//for server to use
	var addPlayer = function(newPlayerID){
		players.push( {id : newPlayerID, spawnPosition : 0 });
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
		render();

		setTimeout( function(){gameLoop()}, timePerFrame );

	}

	var render = function(){
		var obj;
		var staticObjects = physics.getStaticObjects();
		//render map
		for(var i = 0; i < staticObjects.length; i++){
			obj = staticObjects[i];

			ctx.fillStyle = "#FF0000";
			ctx.fillRect(obj.renderX, obj.renderY, obj.width, obj.height);
		}
	}




}