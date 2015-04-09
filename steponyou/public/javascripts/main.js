//init visualizer
var assets = new AssetManager();
var visualizer = new Visualizer();
document.visualizer = visualizer;
assets.load(function() {
    visualizer.init();
});

//init game engin
var gameEngine = new GameEngine("client");
var FPS = 60;
var timePerFrame = 1000/FPS;
var keyMap = [];
var thisPlayer;
document.gameEngine = gameEngine;
keyMap[37] = false;
keyMap[39] = false;

document.addEventListener('keydown', function(event) {

  handleKey(event);

});

document.addEventListener('keyup', function(event) {

  handleKey(event);

});

var setupGameEngin = function (playerID) {
    gameEngine.init(null);

    //add to engine
    thisPlayer = gameEngine.addPlayer(playerID);
    //add this player to room
   // thisPlayer.setPosition(800/2 - 15,600-200);
   // thisPlayer.faceLeft();

    gameEngine.registerCurrentPlayer(playerID);

    gameEngine.start();

    updateVisualizer();
    updateServer();
}
   
var updateVisualizer = function(){

    var updatePack = gameEngine.generateUpdate();
    visualizer.update(updatePack);

    //prepare update
    setTimeout( function(){updateVisualizer()}, timePerFrame );
}

//init network
var lobbyManager = new LobbyManager();
lobbyManager.startConnection(setupGameEngin);


var handleKey = function(e){
    //Player is not playing, don't need to handle his key event
    if(!gameEngine.isPlaying){
        return;
    }
    e = e || event; // to deal with IE
    keyMap[e.keyCode] = e.type == 'keydown';
    /*insert conditional here*/
    //40 - down arrow

    //gameEngine.registerKeys(keyMap);
    var playerEvent = { keyMap : keyMap,
                        pos :  thisPlayer.getPosition() };
    gameEngine.simulatePlayer(lobbyManager.playerId, playerEvent);
	//lobbyManager.sendEvent(lobbyManager.playerId, playerEvent);

}

var updateServer = function(){
     var playerEvent = { keyMap : keyMap,
                        pos :  thisPlayer.getPosition() };
    lobbyManager.sendEvent(lobbyManager.playerId, playerEvent);
    setTimeout(function(){updateServer();} , 33 );
}