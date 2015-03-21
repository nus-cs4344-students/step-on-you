
var phyBdCount = 0;
var TOP = 0;
var BOTTOM = 1;
var LEFT = 2;
var RIGHT = 3;
var Body = require("./Body.js");
module.exports = function Physics(gameEngine) {


	var physicObjects = [];
	var staticObjects = [];
	var Gravity = 5;
	var Damping = 0.5;
	var Scaling = 1;
	var MaxVecX = 20;
	var MaxVecY = 50;


	var runningID = 0;

	this.addPhysicalBody = function(body){
		body.isStatic = false;
		body.objectID = runningID;
		runningID++;
		physicObjects.push(body);
		//console.log("mobile body added");
		//console.log(body);
	}

	this.addStaticBody = function(body){
		body.isStatic = true;
		body.objectID = runningID;
		runningID++;
		staticObjects.push(body);
	}

	this.getStaticObjects = function(){
		return staticObjects;
	}

	this.getPhysicObjects = function(){
		return physicObjects;
	}


	//cardinality of collision wrt body1
	var checkCollision = function(body1, body2){

		var collision1 = {	
					collided : false,
					otherBody : null,
					cardinality : [ false,false,false,false],
					overlapX : [0,0,0,0],
					overlapY : [0,0,0,0]
				}

		var collision2 = {	
					collided : false,
					otherBody : null,
					cardinality : [ false,false,false,false],
					overlapX : [0,0,0,0],
					overlapY : [0,0,0,0]
				}
		/*
		if (body1.renderX < body2.renderX + body2.width  && body1.renderX + body1.width  > body2.renderX &&
			body1.renderY < body2.renderY + body2.height && body1.renderY + body1.height > body2.renderY) {
			// The objects are touching (more of overlapping)
		}
		*/
		//using >= versions because contact-type information is also useful
		var overlap = 0;
		//check for overlapping x range
		if( body1.renderX < body2.renderX + body2.width  && body1.renderX + body1.width > body2.renderX  ){
			//check for within y range
			if ( body1.renderY <= body2.renderY + body2.height && body1.renderY + body1.height >= body2.renderY ){

				//objects are overlapped / touching
				collision1.collided = true;
				collision1.otherBody = body2;

				collision2.collided = true;
				collision2.otherBody = body1;

				//check type of collision : top, bottom, left, right

				//check not "contain"
				//i.e check b2 not in b1
				if( !(body1.renderX < body2.renderX && body1.renderX + body1.width > body2.renderX + body2.width) &&
					//check b1 not in b2
					!(body2.renderX < body1.renderX && body2.renderX + body2.width > body1.renderX + body1.width)
					){

					//if right - body1.renderX < body2.renderX
					//contact right - body1.renderX + body1.width = body2.renderX
					//otherwise left

					//handle right scenario first
					//body1 on the left of body2
					if(body1.renderX < body2.renderX){
						//console.log("right");
						overlap = body1.renderX + body1.width - body2.renderX;
						overlap = Math.abs(overlap);
						//console.log("overlap: " + overlap);
						//set body 1
						collision1.cardinality[RIGHT] = true;
						collision1.overlapX[RIGHT] = overlap;
						body1.setBlockedRight();

						//set body 2
						collision2.cardinality[LEFT] = true;
						collision2.overlapX[LEFT] = overlap;
						body2.setBlockedLeft();
						
					}
					//handle left scenario
					else if(body1.renderX > body2.renderX){
						//console.log("left");
						overlap = body2.renderX + body2.width - body1.renderX;
						overlap = Math.abs(overlap);
						//console.log("overlap: " + overlap);
						//set body 1
						collision1.cardinality[LEFT] = true;
						collision1.overlapX[LEFT] = overlap;
						body1.setBlockedLeft();

						//set body 2
						collision2.cardinality[RIGHT] = true;
						collision2.overlapX[RIGHT] = overlap;
						body2.setBlockedRight();
					}
					//handle when body1.renderX == body2.renderX - this is when it's a top/bottom collision
					else{
						//this will be handled by the next section : top/bottom collision
					}

				}
				else{
					collision1.cardinality[LEFT] = false;
					collision1.cardinality[RIGHT] = false;
					collision2.cardinality[LEFT] = false;
					collision2.cardinality[RIGHT] = false;
				}


				//ensure that 1 object does not contain the other 
				//check that b2 not in b1
				if( !(body1.renderY < body2.renderY && body1.renderY + body1.height > body2.renderY + body2.height) &&
					//check b1 not in b2
					!(body2.renderY < body1.renderY && body2.renderY + body2.height > body1.renderY + body1.height)
					){
				
				//if top - body1.renderY < body2.renderY
				//contact top - body1.renderY = (body2.renderY - body2.height)
				//otherwise bottom
				//console.log("not in");
				//handle top scenario first
				if(body1.renderY > body2.renderY){
					//console.log("top");
					if(body1.isPlayer() && body2.isPlayer()){
						console.log("player 2 killed player 1");

						if(gameEngine.role == "server"){
							gameEngine.addPlayerScore(body2.objectID);
						}
					}

					overlap = body1.renderY - (body2.renderY + body2.height);
					overlap = Math.abs(overlap);
					//set body 1
					collision1.cardinality[TOP] = true;
					collision1.overlapY[TOP] = overlap;
					body1.setBlockedUp();

					//set body 2
					collision2.cardinality[BOTTOM] = true;
					collision2.overlapY[BOTTOM] = overlap;
					body2.setBlockedDown();
				}
				//handle if bottom
				else if(body1.renderY < body2.renderY){
					//console.log("bottom");

					if(body1.isPlayer() && body2.isPlayer()){
						//console.log("player 1 killed player 2");
						if(gameEngine.role == "server"){
							gameEngine.addPlayerScore(body1.objectID);
						}
					}

					overlap = body2.renderY - (body1.renderY + body1.height);
					overlap = Math.abs(overlap);
					//set body 1
					collision1.cardinality[BOTTOM] = true;
					collision1.overlapY[BOTTOM] = overlap;
					body1.setBlockedDown();
					//console.log("body1.setblockeddown");

					//set body 2
					collision2.cardinality[TOP] = true;
					collision2.overlapY[TOP] = overlap;
					body2.setBlockedUp();
				}
				//handle if body1.renderY == body2.renderY
				else{
					//this is a left / right collision, handled above

				}

			}
			else{
				collision1.cardinality[BOTTOM] = false;
				collision1.cardinality[TOP] = false;
				collision2.cardinality[BOTTOM] = false;
				collision2.cardinality[TOP] = false;
			}

				//console.log("collided");

				body1.addCollisionID(body2.objectID);
				body2.addCollisionID(body1.objectID);

				body1.addCollision(body2.objectID, collision1);
				body2.addCollision(body1.objectID, collision2);

				//console.log("checkGroundCOntact : " + collision1.cardinality[BOTTOM]);

			}

		}

	}


	//check contact with ground
	var checkContactWithGround = function(body){
		//console.log("checkContactWithGround");
		for(var j = 0; j < staticObjects.length; j++){
			checkCollision(body, staticObjects[j]);
		}
	}

	//check contact with other modbile elements
	var checkContactWithOther = function(){
		var body;
		//for all non-static bodies
		for(var i = 0; i < physicObjects.length; i++){
			body = physicObjects[i];
			//check for collision with non-static bodies
			for(var j = 0; j < physicObjects.length; j++){
				//i != j to prevent self colliding
				//j > 1 so that if tested b1 and b3 collide, wun test b3 and b1 collide
				if(j > i){
					checkCollision(body, physicObjects[j]);
				}
			}
		}
	}

	//function to detect a collision between 2 bodies and 
	var detectCollisions = function(){
		var body;
		//for all non-static bodies
		for(var i = 0; i < physicObjects.length; i++){
			body = physicObjects[i];
			//check for collision with static bodies
			for(var j = 0; j < staticObjects.length; j++){
				checkCollision(body, staticObjects[j]);
			}
			//check for collision with non-static bodies
			for(var j = 0; j < physicObjects.length; j++){
				//i != j to prevent self colliding
				//j > 1 so that if tested b1 and b3 collide, wun test b3 and b1 collide
				if(j > i){
					checkCollision(body, physicObjects[j]);
				}
			}


		}

	}


	this.step = function(){
		/*
		for all moving objects, 
		reset collision data
		set moved to false
		check contact with static bodies and arrest motion if needed (changing velocity)
		move by velocity
		check for collision (and reverse velocity movement if needed)
		change velocity if needed (due to collision. e.g collide with ground at bottom means no gravtiy due to support) 
		vecX gets reset after every step
		then apply gravity if not supported by ground
		*/
		var body;
		for(var i = 0; i < physicObjects.length; i++){
			body = physicObjects[i];

			//rounding errors
			/*
			if(Math.abs(body.getVecX()) < 0.2){
				body.setVecX(0);
			}

			if(Math.abs(body.getVecY()) < 0.2){
				body.setVecY(0);
			}
			*/


			body.moved = false;

			//apply changes to velocity due to acceleration and gravity
			//console.log("accX: " + body.getAccX());
			//console.log("accY: " + body.getAccY());
			//console.log("game engine tpf: " + gameEngine.timePerFrame);
			
			

			var newVecX = body.getVecX() + ( body.getAccX() ) * 1000/60/1000;
			var newVecY = body.getVecY() + (body.getAccY() ) * 1000/60/1000;
			//console.log("newVecX: " + newVecX + ", newVecY: " + newVecY);
			
			//limit max velocity

			
			if(Math.abs(newVecX) > MaxVecX){
				newVecX *= MaxVecX / Math.abs(newVecX);
			}
			

			if(Math.abs(newVecY) > MaxVecY){
				newVecY *= MaxVecY / Math.abs(newVecY);
			}

			//console.log("newVecX: " + newVecX + ", newVecY: " + newVecY);
			//console.log("accY: "+body.getAccY());

			body.setVecX( newVecX );
			body.setVecY( newVecY );

			//damp acceleration
			//body.dampAccX(Damping);

			

			body.dampVecX(Damping);

			//apply gravity if not supported
			//console.log(body.getBlockedDown());
				body.setAccY( body.getAccY() + Gravity );
				
				if( body.getBlockedDown() && body.getAccY() > 0){
					body.setAccY(0);
					body.setVecY(0);
				}
				
			

			if(body.getBlockedUp()){

				if(body.getAccY() < 0){
					body.setAccY(0);
				}
				if(body.getVecY() < 0){
					body.setVecY(0);
				}

			}

			if(body.getBlockedLeft()){
				if(body.getAccX() < 0){
					body.setAccX(0);
				}
				if(body.getVecX() < 0){
					body.setVecX(0);
				}
			}

			if(body.getBlockedRight()){
				if(body.getAccX() > 0){
					body.setAccX(0);
				}
				if(body.getVecX() > 0){
					body.setVecX(0);
				}
			}


			
			if(body.getVecX() > 0 && !body.getBlockedRight()){
				body.renderX += body.getVecX();
			}
			else if(body.getVecX() < 0 && !body.getBlockedLeft()){
				body.renderX += body.getVecX();
			}
			
			//console.log("old renderY: " + body.renderY);

			body.renderY += body.getVecY();

			//console.log("newRenderY: " + body.renderY);

			//old jump (teleport)
			//console.log(body.getBlockedDown());
			//console.log(body.getAccY());
			/*
			if(body.getJumped() && body.getBlockedDown() == true){
				//console.log("handling jump");
				//console.log("ori y: " + body.renderY())
				//console.log(body.getJumpHeight());
				//ensure no obstacle overhead

				
				if(body.getBlockedUp() == false)
					body.renderY -= body.getJumpHeight();
				body.resetJump();
				


			}
			else{
				body.renderY += body.getVecY();
			}
			*/

			body.moved = body.getVecX() != 0 || body.getVecY() != 0;
			
			//body.setVecX(0);

			body.resetCollision();

			
			/*
			//apply gravity
			if(body.getVecY() < 0){
				body.setVecY( body.getVecY() + Gravity);
			}
			else{
				body.setVecY(Gravity);
			}
			*/


			//check contact with ground
			checkContactWithGround(body);

			body.collisions = body.getCollisions();
			body.collisionIDs = body.getCollisionIDs();

			//console.log("numCollisions: "+body.collisionIDs.length);

			//if > 1 collision : means with ground
			if(body.collisionIDs.length > 0){
				for(var j = 0; j < body.collisionIDs.length; j++){
					var c = body.collisions[ body.collisionIDs[j] ];
					//console.log(c);

					if(c.cardinality[TOP]){
						body.setBlockedUp();
						if(body.getVecY() < 0){
							body.setVecY(0);
						}
					}
					if(c.cardinality[BOTTOM]){
						body.setBlockedDown();
						if(body.getVecY() > 0){
							body.setVecY(0);
						}
					}
					if(c.cardinality[LEFT]){
						body.setBlockedLeft();
						if(body.getVecX() < 0){
							body.setVecX(0);
						}
					}
					if(c.cardinality[RIGHT]){
						body.setBlockedRight();
						if(body.getVecX() > 0){
							body.setVecX(0);
						}
					}

				}
			}

			//move the object

			//console.log(body.getVecX() + ", " + body.getVecY());
			
			body.setNumGroundCollisions(body.collisionIDs.length);
			body.setBodyCollisionIndex(body.collisionIDs.length);

		}

		//moved all objects
		//check for collisions
		
		//detectCollisions();
		checkContactWithOther();

		collisionResolution();


	}

	var collisionResolution = function(){

		var body;

		for(var i = 0; i < physicObjects.length; i++){
			body = physicObjects[i];

			//handle all collisions (prevent overlapping of sprites)
			//console.log(body);
			//handles collision with static bodies
			body.bodyCollisionIndex = body.getBodyCollisionIndex();
			body.collisionIDs = body.getCollisionIDs();
			body.collisions = body.getCollisions();

			//console.log(body.collisionIDs);
			//console.log(body.bodyCollisionIndex);

			for(var j = 0; j < body.bodyCollisionIndex ; j++){
				var c = body.collisions[ body.collisionIDs[j] ];
				//console.log(c);
				var b2 = c.otherBody;

				//handle bottom
				if(c.cardinality[BOTTOM]){
					var o = c.overlapY[BOTTOM];
					//console.log("bottom : " + o);
					body.renderY = body.renderY - o;
				}
				//handle top
				else if(c.cardinality[TOP]){
					var o = c.overlapY[TOP];
					body.renderY = body.renderY + o;
				}
				
				//handle right
				else if(c.cardinality[RIGHT]){
					//console.log("right collision");
					var o = c.overlapX[RIGHT];
					body.renderX = body.renderX - o;
				}

				//handle left
				else if(c.cardinality[LEFT]){
					//console.log("left collision");
					var o = c.overlapX[LEFT];
					body.renderX = body.renderX + o;
				}
			}
			

			//handles collisionw ith other mobile bodies
			for(var j = body.bodyCollisionIndex; j < body.collisionIDs.length ; j++){
				var c = body.collisions[ body.collisionIDs[j] ];
				var b2 = c.otherBody;

				//means this killed other body
				//server decides kill
				//client waits for server decision
				if(c.cardinality[BOTTOM]){
					//GameEngine.evaluate(body, b2);
				}
				else if(c.cardinality[TOP]){

				}
				//perfor, correction only if alive
				else{
					//handle right
					if(c.cardinality[RIGHT]){
						var o = c.overlapX[RIGHT];
						
						//check for corrected position (don't move corrected?)
						//check for restricted movement before correcting position
						//right collision means b1 move < , b2 move >
						if(o > 0){
							//< and > ok
							if(!body.getBlockedLeft() && !b2.getBlockedRight()){
								body.setRenderX( body.getRenderX() - 0.5 * o);
								b2.setRenderX ( b2.getRenderX() + 0.5 * o);
							}
							//< ok 
							else if(!body.getBlockedLeft()  && b2.getBlockedRight()){
								body.setRenderX( body.getRenderX() - o);
							}
							//> ok
							else if(body.getBlockedLeft()  && !b2.getBlockedRight()){
								b2.setRenderX( b2.getRenderX() + o);
							}
								
						}

						body.setCorrected(true);
						b2.setCorrected(true);
					}

					//handle left
					if(c.cardinality[LEFT]){
						var o = c.overlapX[LEFT];

						if(o > 0){
							//< and > ok
							if(!body.getBlockedRight() && !b2.getBlockedLeft()){
								body.renderX = body.renderX + 0.5 * o;
								b2.renderX = b2.renderX - 0.5 * o;
							}
							//< ok 
							else if(body.getBlockedRight()  && !b2.getBlockedLeft()){
								b2.renderX = b2.renderX - o;
							}
							//> ok
							else if( !body.getBlockedRight()  && b2.getBlockedLeft()){
								body.renderX = body.renderX + o;
							}
								
						}


						body.setCorrected(true);
						b2.setCorrected(true);
					}
			}
				
				/*
				top and bottom are PKS! no need sprite correction
				//handle top
				if(c.cardinality[TOP]){
					var o = c.overlapX[TOP];
					var b2 = c.otherBody;
					body.renderX = body.renderX + 0.5 * o;
					b2.renderX = body2.renderX - 0.5 * o;
					body.corrected = true;
					b2.corrected = true;
				}


				//handle bottom
				*/

			}


		}
	}




}