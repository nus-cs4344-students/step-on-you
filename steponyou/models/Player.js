var Body = require("./Body.js");
module.exports = 

function Player(pid) {

	var playerID = pid;
	var body = new Body();
	body.setIsPlayer();
	//movement speed
	var speed = 2;
	var maxSpeed = 20;
	var acceleration = 50;
	var jump = 200;
	var Scale = 1;

	body.width = 100;
	body.height = 100;

	var maxAccX = 2000;
	var maxAccY = 20;

	var jumpAcc = 65;

	this.applyGravity = true;

	this.setDefaultVec = function(){
		console.log("set default");
		body.setDefaultVec();
		console.log(body.getVecX() + " ," + body.getVecY());
		acceleration = 50;
	}

	this.pushHistory = function(element){
		body.history.push(element);
	}

	this.fallThrough = function(){
		//if body supported below by a static platform
		if(body.getBlockedDown() && body.getSupportingPlatform().isStatic && body.getSupportingPlatform().getPermissible()){
			body.y += 5;
			body.renderY += 5;
		}
	}

	this.setPosition = function(x,y){
		body.renderX = x;
		body.renderY = y;
		body.x = x;
		body.y = y;
		/*
		body.vecX = 0;
		body.vecY = 0;
		body.accX = 0;
		body.accY = 0;
		*/
		//console.log(pid);
		//console.log( body.renderX + "," + body.renderY);
		//console.log(body.width + ", " + body.height);
	}

	this.getPosition = function(){
		return { x: body.renderX, y: body.renderY};
	}

	this.setApplyGravity = function(b){
		this.applyGravity = b;
		body.applyGravity = b;
	}

	this.faceLeft = function(){
		body.orientation = "left";
	}

	this.faceRight = function(){
		body.orientation = "right";
	}

	this.getBody = function(){
		return body;
	}

	this.moveLeft = function(){
		this.faceLeft();

		/*
		var newVecX = body.getVecX() - speed;

		if(Math.abs(newVecX) > maxSpeed){
			newVecX = maxSpeed / Math.abs(newVecX);
		}

		body.setVecX(newVecX);
		*/

		
		//body.setVecX(body.getVecX() - speed);
		//var newAcc = body.getAccX() - acceleration;
		var newAcc = - acceleration;

		//console.log(newAcc);
	
		
		if( Math.abs(newAcc) > maxAccX ){
			newAcc *=   maxAccX / Math.abs(newAcc);
		}


		//console.log(newAcc);
		//console.log(maxAccX / Math.abs(newAcc));
		//console.log(newAcc);

		body.setAccX( newAcc );
		body.setDampDirection("left");
		
		
	}

	this.moveRight = function(){
		this.faceRight();

		/*
		var newVecX = body.getVecX() + speed;

		if(Math.abs(newVecX) > maxSpeed){
			newVecX = maxSpeed / Math.abs(newVecX);
		}

		body.setVecX(newVecX);
		*/

		
		//body.setVecX (body.getVecX() + speed);
		//var newAcc = body.getAccX() + acceleration;
		var newAcc = acceleration;
		if( Math.abs(newAcc) > maxAccX ){
			newAcc *=  maxAccX / Math.abs( newAcc);
		}
		//console.log(maxAccX / Math.abs(newAcc));
		//console.log(newAcc);

		body.setAccX( newAcc );
		body.setDampDirection("right");
		
	}

	this.removeAccelerationX = function(){
		body.setAccX(0);
	}

	this.jump = function(){
		//if the player is "supported" by sth below
		body.jumpAcc(jumpAcc);
	}

}