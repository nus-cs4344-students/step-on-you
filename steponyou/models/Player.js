var Body = require("./Body.js");
module.exports = function Player(pid) {

	var playerID = pid;
	var body = new Body();
	body.setIsPlayer();
	//movement speed
	var speed = 20;
	var acceleration = 20;
	var jump = 200;
	var Scale = 1;

	body.width = 100;
	body.height = 100;

	var maxAccX = 20;
	var maxAccY = 20;

	var jumpAcc = 65;

	this.setPosition = function(x,y){
		body.renderX = x;
		body.renderY = y;
		body.x = x;
		body.y = y;
		body.vecX = 0;
		body.vecY = 0;
		body.accX = 0;
		body.accY = 0;
		//console.log(pid);
		//console.log( body.renderX + "," + body.renderY);
		//console.log(body.width + ", " + body.height);
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

		//body.setVecX(body.getVecX() - speed);
		var newAcc = body.getAccX() - acceleration;

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

		//body.setVecX (body.getVecX() + speed);
		var newAcc = body.getAccX() + acceleration;
		if( Math.abs(newAcc) > maxAccX ){
			newAcc *=  maxAccX / Math.abs( newAcc);
		}
		//console.log(maxAccX / Math.abs(newAcc));
		//console.log(newAcc);
		body.setAccX( newAcc );
		body.setDampDirection("right");
	}

	this.jump = function(){
		//if the player is "supported" by sth below
		body.jumpAcc(jumpAcc);
	}

}