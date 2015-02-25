
function Body(w,h) {
	
	//misc information
	var objectID = phyBdCount++;

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
	
	//velocity
	var vecX = 0;
	var vecY = 0;

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

	this.resetVecX = function(){
		vecX = 0;
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
		return blockedDown;
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


}

