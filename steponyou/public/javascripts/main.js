var assets = new AssetManager();
var visualizer = new Visualizer();
var gameEngine = new GameEngine("client");
var FPS = 60;
var timePerFrame = 1000/FPS;
var keyMap = [];

assets.load(function() {
		visualizer.init();

		setupControls();
		
		//game engine initialization
		
    	gameEngine.init(null);
    	//creation of player id
    	var playerID = Math.floor(Math.random()*10);
    	
    	//add to engine
    	var thisPlayer = gameEngine.addPlayer(playerID);
    	//add this player to room
    	thisPlayer.setPosition(800/2 - 15,600-200);
    	thisPlayer.faceLeft();

        gameEngine.registerCurrentPlayer(playerID);

    	gameEngine.start();

    	updateVisualizer();


	});

var updateVisualizer = function(){

	var updatePack = gameEngine.generateUpdate();
	visualizer.update(updatePack);

	//prepare update
	setTimeout( function(){updateVisualizer()}, timePerFrame );
}

var setupControls = function(){

    document.addEventListener('keydown', function(event) {

      handleKey(event);
   
    });

    document.addEventListener('keyup', function(event) {

      handleKey(event);

    });
}

var handleKey = function(e){
    e = e || event; // to deal with IE
    keyMap[e.keyCode] = e.type == 'keydown';
    /*insert conditional here*/
    //40 - down arrow

    gameEngine.registerKeys(keyMap);
    gameEngine.processInput();

}