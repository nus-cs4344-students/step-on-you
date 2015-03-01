
function Player(pid) {

	var playerID = pid;
	var body = new Body();
	body.setIsPlayer();
	//movement speed
	var speed = 20;
	var jump = 200;
	var Scale = 1;

	body.width = 30;
	body.height = 30;

	this.setPosition = function(x,y){
		body.renderX = x;
		body.renderY = y;
		body.x = x;
		body.y = y;
		body.vecX = 0;
		body.vecY = 0;
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
		body.setVecX(body.getVecX() - speed);
		
	}

	this.moveRight = function(){
		this.faceRight();
		body.setVecX (body.getVecX() + speed);
		
	}

	this.jump = function(){
		//if the player is "supported" by sth below
		body.setJump(jump);
	}

}