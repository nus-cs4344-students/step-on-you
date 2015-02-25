
function Player(pid) {

	var playerID = pid;
	var body = new Body();
	//movement speed
	var speed = 20;

	body.width = 30;
	body.height = 30;

	this.setPosition = function(x,y){
		body.renderX = x;
		body.renderY = y;
		body.x = x;
		body.y = y;
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

}