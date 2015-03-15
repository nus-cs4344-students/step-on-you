var assets = new AssetManager();
var visualizer = new Visualizer();
var gameEngine = new GameEngine("client");
var FPS = 60;
var timePerFrame = 1000/FPS;

assets.load(function() {
		visualizer.init();

		
		
		//game engine initialization
		
    	gameEngine.init(null);
    	//creation of player id
    	var playerID = Math.floor(Math.random()*10);
    	
    	//add to engine
    	var thisPlayer = gameEngine.addPlayer(playerID);
    	//add this player to room
    	thisPlayer.setPosition(800/2 - 15,600-200);
    	thisPlayer.faceLeft();
    	gameEngine.start();

    	updateVisualizer();
    	


		});

var updateVisualizer = function(){

	var updatePack = gameEngine.generateUpdate();
	visualizer.update(updatePack);

	//prepare update
	//setTimeout( function(){updateVisualizer()}, timePerFrame );
}