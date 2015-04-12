
function Body(w,h) {
	
	//misc information
	var objectID = 0;

	//all positions are based on top-left coordinates, with 0,0 being at top left as well.

	//information for body position
	//rendering position (short circuiting)
	var renderX = 0;
	var renderY = 0;
	//actual position (from server)
	var x = 0;
	var y = 0;
	//target position : for convergence (possibly)
	var targetX = 0;
	var targetY = 0;
	var framesLeftToConverge = 0;
	var advVecX = 0;
	var advVecY = 0;
	//variable to indicate if the current object is still conveging to target position
	var converging = true;
	
	//velocity
	var vecX = 0;
	var vecY = 0;

	//acceleration
	var accX = 0;
	var accY = 0;

	//sprite facing : left or right
	var orientation = "left";
	//sprite dimensions
	var height = h;
	var width = w;

	//whether or not to apply gravity
	var applyGravity = true;
	var isStatic = false;
	var isGround = false;

	//flag whether the player is moving
	var moving = false;
	var moved = false;

	//flags for collision to restrict movement
	var blockedUp = false;
	var blockedDown = false;
	var blockedLeft = false;
	var blockedRight = false;
	var touchingGround = false;
	var jump = 0;
	var jumped = false;

	var isPlayer = false;
	var isDead = false;

	//collision data
	/*
	collided : whether there is a collision
	cardinality : up, down, left, right
	overlap : amount of overlap in the cardinality
	cardinality and overlap are arrays as 1 object may have multiple collisions
	*/

	var collisions = [];
	var groundCollisions = [];
	var collisionIDs = [];
	var numGroundCollisions;// = body.collisions.length;
	var bodyCollisionIndex;// = numGroundCollisions - 1;
	var corrected = false;

	var dampDirection = "";

	var supportingPlatform;
	var permissible = true;

	this.setDefaultVec = function(){
		vecX = 0;
		vecY = 0;
		accX = 0;
		accY = 0;
	}

	this.setPermissible = function(b){
		permissible = b;
	}

	this.setDead = function(){
		isDead = true;
		x = 10000;
		y = 10000;
		renderX = x;
		renderY = y;
	}

	this.revive = function(px,py){
		isDead = false;
		x = px;
		y = py;
		renderX = px;
		renderY = py;
	}

	this.setAlive = function(){
		isDead = false;
	}

	this.isAlive = function(){
		return !isDead;
	}

	this.getPermissible = function(){
		return permissible;
	}

	this.resetCollision = function() {
		collisions = [];
		groundCollisions = [];
		collisionIDs = [];
		corrected = false;

		blockedLeft = false;
		blockedRight = false;
		blockedUp = false;
		blockedDown = false;
		/*
		collision.collided = false;
		collision.cardinality = [false,false,false,false];
		collision.overlapX = [0,0,0,0];
		collision.overlapY = [0,0,0,0];
		*/
	}

	this.setSupportingPlatform = function(p){
		supportingPlatform = p;
	}

	this.getSupportingPlatform = function(){
		return supportingPlatform;
	}

	this.getApplyGravity = function(){
		return applyGravity;
	}

	this.setAccX = function(v){
		accX = v;
	}

	this.setAccY = function(v){
		accY = v;
	}

	this.getAccX = function(){
		return accX;
	}

	this.getAccY = function(){
		return accY;
	}

	this.dampAccX = function(Damping){
		accX = dampX(accX, Damping);
	}


	this.setDampDirection = function(dd){
		dampDirection = dd;
	}

	this.setTargetPos = function(x,y){
		targetX = x;
		targetY = y;
	}

	this.dampVecX = function(d){
		var newVecX = vecX;
		if(vecX > 0){
			vecX = vecX - d;

			if(vecX < 0){
				vecX = 0;
			}
		}

		if(vecX < 0){
			vecX = vecX + d;

			if(vecX > 0){
				vecX = 0;
			}
		}

	}

	var dampX = function(vec, Damping){

		/*
		var t = 0.8*vec; 
		if( Math.abs(t) < 0.3){
			t = 0;
			vecX = 0;
		}

		return t;
		*/


		if(vecX == 0 ){
			//console.log("vecX zero");
			return 0;
		}
		if( vecX > 0 && vec >= 0){
			//console.log("b4: " + vec);
			vec = vec - Damping;
			//console.log("damp right");
			//console.log(vecX);
			/*
			if(vec < 0){
				vec = 0;
			}
			*/
		}

		else if(vecX < 0 && vec <= 0){
			vec = vec + Damping;
			//console.log("Damp left");
			/*
			if(vec > 0){
				vec = 0;
			}
			*/
		}
		//console.log("Damped: " + vec);
		return vec;
	}

	this.setJump = function(j){
		if(blockedDown){
			jump = j;
			accY = -j;
			jumped = true;
		}
		//console.log("setJumped");
	}

	this.jumpAcc = function(j){
		if(blockedDown){
			jump = j;
			accY = -j;
			jumped = true;
		}
		else{
			//console.log("blockedDown: " + blockedDown);
			//console.log("reject jump");
		}
	}

	this.getJumped = function(){
		return jumped;
	}

	this.getJumpHeight = function(){
		return jump;
	}

	this.resetJump = function(){
		jump = 0;
		jumped = false;
	}

	this.resetVecX = function(){
		vecX = 0;
	}

	this.getWidth = function(){
		return width;
	}

	this.getHeight = function(){
		return height;
	}

	this.getCollisions = function(){
		return collisions;
	}

	this.getCollisionIDs = function(){
		return collisionIDs;
	}

	this.setNumGroundCollisions = function(n){
		numGroundCollisions = n;
	}
	this.setBodyCollisionIndex = function(bc){
		bodyCollisionIndex = bc;
	}

	this.getBodyCollisionIndex = function(bc){
		return bodyCollisionIndex;
	}

	this.getVecX = function(){
		return vecX;
	}

	this.getVecY = function(){
		return vecY;
	}

	this.setVecX = function(vx){
		vecX = vx;
	}

	this.setVecY = function(vy){
		vecY = vy;
	}

	this.addCollisionID = function(id){
		collisionIDs.push(id);
	}

	this.addCollision = function(id, col){
		collisions[id] = col;
	}

	this.setCorrected = function(b){
		corrected = b;
	}

	this.setBlockedLeft = function(){
		blockedLeft = true;
	}

	this.setBlockedRight = function(){
		blockedRight = true;
	}

	this.setBlockedUp = function(){
		blockedUp = true;
	}

	this.setBlockedDown = function(){
		blockedDown = true;
	}

	this.getBlockedLeft = function(){
		return blockedLeft;
	}

	this.getBlockedRight = function(){
		return blockedRight;
	}

	this.getBlockedUp = function(){
		return blockedUp;
	}

	this.getBlockedDown = function(){
		return blockedDown;
	}

	this.isStatic = function(){
		return isStatic;
	}

	this.getRenderX = function(){
		return renderX;
	}

	this.getRenderY = function(){
		return renderY;
	}

	this.setRenderX = function(x){
		renderX = x;
	}

	this.setRenderY = function(y){
		renderY = y;
	}

	this.setIsPlayer = function(){
		isPlayer = true;
	}

	this.isPlayer = function(){
		return isPlayer;
	}

}

