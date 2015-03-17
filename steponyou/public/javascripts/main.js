//init visualizer
var assets = new AssetManager();
var visualizer = new Visualizer();

assets.load(function() {
    visualizer.init();
});

//init game engin
var gameEngine = new GameEngine("client");
var FPS = 60;
var timePerFrame = 1000/FPS;
var keyMap = [];
document.gameEngine = gameEngine;

var setupGameEngin = function (playerID) {
    gameEngine.init(null);

    //add to engine
    var thisPlayer = gameEngine.addPlayer(playerID);
    //add this player to room
    thisPlayer.setPosition(800/2 - 15,600-200);
    thisPlayer.faceLeft();

    gameEngine.registerCurrentPlayer(playerID);

    gameEngine.start();

    updateVisualizer();
}

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

//init network
var lobbyManager = new LobbyManager();
lobbyManager.startConnection(setupGameEngin);


var handleKey = function(e){
    e = e || event; // to deal with IE
    keyMap[e.keyCode] = e.type == 'keydown';
    /*insert conditional here*/
    //40 - down arrow

    gameEngine.registerKeys(keyMap);
    gameEngine.simulatePlayer(lobbyManager.getPID(),keyMap);

}