
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

	body.width = 50;
	body.height = 50;

	var maxAccX = 2000;
	var maxAccY = 20;

	var jumpAcc = 65;

	this.applyGravity = true;

	this.converging = false;

	this.setDefaultVec = function(){
		//console.log("set default");
		body.setDefaultVec();
		//console.log(body.getVecX() + " ," + body.getVecY());
		acceleration = 50;
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


	this.defineConvergence = function(x, y , numFrames){

		//safety check : nothing to converge
		if(body.renderX == x && body.renderY == y){
			return;
		}

		if(body.framesLeftToConverge > 0){
			//console.log("player: unable to register convergence as old task has not been completed");
			return;
		}

		body.framesLeftToConverge = numFrames;
		body.targetX = x;
		body.targetY = y;
		body.advVecX = (x - body.renderX) / numFrames;
		body.advVecY = (y - body.renderY) / numFrames;
		this.converging = true;
		//console.log("defined convergence: " + body.advVecX + ", " + body.advVecY);
	}

	this.performConvergence = function(){
		if(this.converging == false){
			//console.log("player: no converge task. returning");
			return;
		}

		body.framesLeftToConverge--;

		if(body.framesLeftToConverge < 0){
			console.log("player: converge frames exceeded. returning.");
			body.renderX = body.targetX;
			body.renderY = body.targetY;
			body.x = body.renderX;
			body.y = body.renderY;
			this.converging = false;
			return;
		}
		//if it is the last frame, just hop to final position (prevents float errors)
		if(body.framesLeftToConverge == 0){
			body.renderX = body.targetX;
			body.renderY = body.targetY;
			body.x = body.renderX;
			body.y = body.renderY;
			this.converging = false;
		}
		else{
			body.renderX = body.renderX + body.advVecX;
			body.renderY = body.renderY + body.advVecY;
			body.x = body.renderX;
			body.y = body.renderY;
		}
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

		//console.log(body.width + ", " +  body.height);
	
		
		if( Math.abs(newAcc) > maxAccX ){
			newAcc *=   maxAccX / Math.abs(newAcc);
		}

		//console.log("leftAcc: "  + newAcc);

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