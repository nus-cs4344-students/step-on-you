//init network
var lobbyManager = new LobbyManager();

//init visualizer
var assets = new AssetManager();
var visualizer = new Visualizer();

//init game engin
var gameEngine = new GameEngine("client");
var FPS = 60;
var timePerFrame = 1000/FPS;
var keyMap = [];
var playerID = 1;
document.gameEngine = gameEngine;
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

    keyMap[37] = false;
    keyMap[39] = false;

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
    gameEngine.simulatePlayer(lobbyManager.getPID(),keyMap);

}