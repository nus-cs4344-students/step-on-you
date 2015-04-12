//init visualizer
var assets = new AssetManager();
var visualizer = new Visualizer();
document.visualizer = visualizer;
assets.load(function() {
    visualizer.init();
});

//init game engin
var gameEngine;// = new GameEngine("client");
var FPS = 60;
var timePerFrame = 1000/FPS;
var keyMap = [];
var thisPlayer;
document.gameEngine = gameEngine;
keyMap[37] = false;
keyMap[39] = false;
var maximumLocalLag = 0;


document.addEventListener('keydown', function(event) {

  handleKey(event);

});

document.addEventListener('keyup', function(event) {

  handleKey(event);

});

var setupGameEngin = function (playerID) {
    gameEngine = new GameEngine("client");
	gameEngine.changeFPS(FPS);
    visualizer.reset();
    gameEngine.init(null);

    //add to engine
    thisPlayer = gameEngine.addPlayer(playerID);

    //add this player to room
   // thisPlayer.setPosition(800/2 - 15,600-200);
   // thisPlayer.faceLeft();

    gameEngine.registerCurrentPlayer(playerID);

    updateServer();

    gameEngine.start();
    visualizer.reset();
    

    var map = gameEngine.getMap();
    visualizer.updateMap(map);

    updateVisualizer();
    //updateServer();
}
   
var updateVisualizer = function(){

    var updatePack = gameEngine.generateUpdate();
    visualizer.update(updatePack);

    //prepare update
    setTimeout( function(){updateVisualizer()}, timePerFrame );
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

if(isMobile.any()){
	FPS = 30;
	console.log("Mobile device FPS " + FPS)
}else{
	console.log("not mobile device")
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
	
	lobbyManager.sendEvent(lobbyManager.playerId, playerEvent);

	//console.log("Current local lag: " + lobbyManager.localLag);
	setTimeout( function(){gameEngine.simulatePlayer(lobbyManager.playerId, playerEvent); },
				Math.min(lobbyManager.localLag, maximumLocalLag) );
    
}

var updateServer = function(){

	//only need to update if alive
	var thisPlayerIsAlive = gameEngine.getCurrentPlayerStatus();

	if(thisPlayerIsAlive){
	     var playerEvent = { keyMap : keyMap,
	                        pos :  thisPlayer.getPosition() };
	    lobbyManager.sendEvent(lobbyManager.playerId, playerEvent);
	}

    //setTimeout(function(){updateServer();} , 330 );
}

//mobile controls
var tiltLeft = false;
var tiltRight = false;
var tapJump = false;

var mCenter = 0;
var pThreshold = 20;
var lThreshold = 10;
var magnetometer  = function(event){
	if(dOrient == 1){ //portrait
		//gamma: [-90, 0) , 0 , (0, 90]
		if(event.gamma < mCenter - pThreshold){ //tilt left
			tiltLeft = true;
			tiltRight = false;
		}
		else if(event.gamma > mCenter + pThreshold){ //tilt right
			tiltLeft = false;
			tiltRight = true;
		}
		else{ //neutral position
			tiltLeft = false;
			tiltRight = false;
		}
	}
	else if(dOrient == 0){ // landscape left 
		//beta: -ve , 0 , +ve
		if(event.beta < mCenter - lThreshold){ //tilt left
			tiltLeft = true;
			tiltRight = false;
		}
		else if(event.beta > mCenter + lThreshold){ //tilt right
			tiltLeft = false;
			tiltRight = true;
		}
		else{ //neutral position
			tiltLeft = false;
			tiltRight = false;
		}
	}
	else if(dOrient == 2){ // landscape right
		//beta: +ve, 0 , -ve
		if(event.beta > mCenter + lThreshold){ //tilt left
			tiltLeft = true;
			tiltRight = false;
		}
		else if(event.beta < mCenter - lThreshold){ //tilt right
			tiltLeft = false;
			tiltRight = true;
		}
		else{ //neutral position
			tiltLeft = false;
			tiltRight = false;
		}
	}

	convertMobileEvent();
}

var startJump = function(){
	tapJump = true;
	convertMobileEvent();
}

var endJump = function(){
	tapJump = false;
	convertMobileEvent();
}

var convertMobileEvent = function(){
	if(!gameEngine.isPlaying){
        return;
    }
	keyMap[37] = tiltLeft;
	keyMap[38] = tapJump;
	keyMap[39] = tiltRight;

    var playerEvent = { keyMap : keyMap,
                        pos :  thisPlayer.getPosition() };
	lobbyManager.sendEvent(lobbyManager.playerId, playerEvent);
	setTimeout( function(){gameEngine.simulatePlayer(lobbyManager.playerId, playerEvent); },
				Math.max(lobbyManager.localLag, maximumLocalLag) );
}

var previousOrientation = window.orientation;
var dOrient = 1;
var checkOrientation = function(){
    if(window.orientation !== previousOrientation){
        previousOrientation = window.orientation;
		console.log(previousOrientation);
		if(previousOrientation == 0){ //portrait
			dOrient = 1;
		}
		else if(previousOrientation == -90){ //landscape rotate right
			dOrient = 2;
		}
		else if(previousOrientation == 90){ //landscape rotate left
			dOrient = 0;
		}
    }
};

//add mobile event listeners
if(window.DeviceOrientationEvent){
	window.addEventListener("deviceorientation", magnetometer, false);
}else{
	console.log("DeviceOrientationEvent is not supported");
}

window.addEventListener("touchstart", startJump, false);
window.addEventListener("touchmove", startJump, false);
window.addEventListener("touchend", endJump, false);
window.addEventListener("touchcancel", endJump, false);
window.addEventListener("resize", checkOrientation, false);
window.addEventListener("orientationchange", checkOrientation, false);

//check start orientation
if(window.orientation == 0){ //portrait
	dOrient = 1;
}
else if(window.orientation == 90){ //lanscape left
	dOrient = 0;
}
else if(window.orientation == -90){ //lanscape right
	dOrient = 2;
}

