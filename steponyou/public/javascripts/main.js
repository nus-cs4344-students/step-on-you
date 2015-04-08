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
	lobbyManager.sendEvent(lobbyManager.playerId, playerEvent);

}

//mobile controls
var tiltLeft = false;
var tiltRight = false;
var tapJump = false;

var rotationCenter = 0;
var accelerometer  = function(event){
	var g = [];
	g[0] = event.accelerationIncludingGravity.x;
	g[1] = event.accelerationIncludingGravity.y;
	g[2] = event.accelerationIncludingGravity.z;

	var norm_Of_g = Math.sqrt(g[0] * g[0] + g[1] * g[1] + g[2] * g[2]);

	// Normalize the accelerometer vector
	g[0] = g[0] / norm_Of_g;
	g[1] = g[1] / norm_Of_g;
	g[2] = g[2] / norm_Of_g;
	
	var rotation = Math.atan2(g[1], g[0]);
	if(rotationCenter < rotation){ //tilt right?
		tiltLeft = false;
		tiltRight = true;
	}
	else if(rotation < rotationCenter){ //tilt left??
		tiltLeft = true;
		tiltRight = false;
	}
	else{
		tiltLeft = false;
		tiltRight = false;
	}
	document.getElementById("calcr").innerHTML = rotation;
	convertMobileEvent();
}

var startAlpha;
var mCenter = 0;
var mThreshold = 20;
var magnetometer  = function(event){
	document.getElementById("alph").innerHTML = event.alpha;
	document.getElementById("bet").innerHTML = event.beta;
	document.getElementById("gamm").innerHTML = event.gamma;
	if(startAlpha == null){ //init start compass
		startAlpha = event.alpha;
	}
	if(dOrient == 1){ //portrait
		//gamma: [-90, 0) , 0 , (0, 90]
		if(event.gamma < mCenter - mThreshold){ //tilt left
			tiltLeft = true;
			tiltRight = false;
		}
		else if(event.gamma > mCenter + mThreshold){ //tilt right
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
		if(event.beta < mCenter - mThreshold){ //tilt left
			tiltLeft = true;
			tiltRight = false;
		}
		else if(event.beta > mcenter + mThreshold){ //tilt right
			tiltLeft = false;
			tiltRight = true;
		}
		else{ //neutral position
			tiltLeft = false;
			tiltRight = false;
		}
	}
	else if(dOrient == 1){ // landscape right
		//beta: +ve, 0 , -ve
		if(event.beta > mcenter + mThreshold){ //tilt left
			tiltLeft = true;
			tiltRight = false;
		}
		else if(event.beta < mCenter - mThreshold){ //tilt right
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
    gameEngine.simulatePlayer(lobbyManager.playerId, playerEvent);
	lobbyManager.sendEvent(lobbyManager.playerId, playerEvent);
}

var previousOrientation = window.orientation;
var dOrient = 1;
var checkOrientation = function(){
    if(window.orientation !== previousOrientation){
        previousOrientation = window.orientation;
		console.log(previousOrientation);
		if(previousOrientation == 0){ //portrait
			dOrient = 1;
			gammaCenter = 0;
			rotationCenter = 0;
			document.getElementById("dori").innerHTML = "portrait";
			
		}
		else if(previousOrientation == -90){ //landscape rotate right
			dOrient = 2;
			gammaCenter = 90;
			rotationCenter = -90;
			document.getElementById("dori").innerHTML = "lright";
		}
		else if(previousOrientation == 90){ //landscape rotate left
			dOrient = 1;
			gammaCenter = -90;
			rotationCenter = 90;
			document.getElementById("dori").innerHTML = "lleft";
		}
    }
};

//add mobile event listeners
if(document.DeviceMotionEvent){
	window.addEventListener("devicemotion", accelerometer, false);
	document.getElementById("dmotion").innerHTML = "yes";
}else{
	console.log("DeviceMotionEvent is not supported");
	document.getElementById("dmotion").innerHTML = "no";
}

if(window.DeviceOrientationEvent){
	window.addEventListener("deviceorientation", magnetometer, false);
	document.getElementById("dmOrient").innerHTML = "yes";
}else{
	console.log("DeviceOrientationEvent is not supported");
	document.getElementById("dmOrient").innerHTML = "no";
}

window.addEventListener("touchstart", startJump, false);
window.addEventListener("touchmove", startJump, false);
window.addEventListener("touchend", endJump, false);
window.addEventListener("touchcancel", endJump, false);

window.addEventListener("resize", checkOrientation, false);
window.addEventListener("orientationchange", checkOrientation, false);
