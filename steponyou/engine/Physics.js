
var phyBdCount = 0;
var TOP = 0;
var BOTTOM = 1;
var LEFT = 2;
var RIGHT = 3;

function Physics() {

	var physicObjects = [];
	var staticObjects = [];
	var Gravity = 10;

	this.addPhysicalBody = function(body){
		physicObjects.push(body);
		//console.log("mobile body added");
		//console.log(body);
	}

	this.addStaticBody = function(body){
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
					cardinality : ["none","none","none","none"],
					overlapX : [0,0,0,0],
					overlapY : [0,0,0,0]
				}

		var collision2 = {	
					collided : false,
					otherBody : null,
					cardinality : ["none","none","none","none"],
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
		if( body1.renderX <= body2.renderX + body2.width  && body1.renderX + body1.width >= body2.renderX  ){
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
				if( !(body1.renderX < body2.renderX && body1.renderX + body1.width > body2.x + body2.width) &&
					//check b1 not in b2
					!(body2.renderX < body1.renderX && body2.renderX + body2.width > body1.x + body1.width)
					){

					//if right - body1.renderX < body2.renderX
					//contact right - body1.renderX + body1.width = body2.renderX
					//otherwise left

					//handle right scenario first
					if(body1.renderX < body2.renderX){
						overlap = body1.renderX + body1.width - body2.renderX;
						//set body 1
						collision1.cardinality[RIGHT] = true;
						collision1.overlapX[RIGHT] = overlap;

						//set body 2
						collision2.cardinality[LEFT] = true;
						collision2.overlapX[LEFT] = overlap;
						
					}
					//handle left scenario
					else if(body1.renderX > body2.renderX){
						overlap = body2.renderX + body2.width - body1.renderX;
						//set body 1
						collision1.cardinality[LEFT] = true;
						collision1.overlapX[LEFT] = overlap;

						//set body 2
						collision2.cardinality[RIGHT] = true;
						collision2.overlapX[RIGHT] = overlap;
					}
					//handle when body1.renderX == body2.renderX - this is when it's a top/bottom collision
					else{
						//this will be handled by the next section : top/bottom collision
					}

				}

				//if top - body1.renderY < body2.renderY
				//contact top - body1.renderY = (body2.renderY - body2.height)
				//otherwise bottom

				//handle top scenario first
				if(body1.renderY > body2.renderY){
					overlap = body1.renderY - (body2.renderY - body2.height);
					//set body 1
					collision1.cardinality[TOP] = true;
					collision1.overlapY[TOP] = overlap;

					//set body 2
					collision2.cardinality[BOTTOM] = true;
					collision2.overlapY[BOTTOM] = overlap;
				}
				//handle if bottom
				else if(body1.renderY < body2.renderY){
					overlap = body2.renderY - (body1.renderY - body1.height);
					//set body 1
					collision1.cardinality[BOTTOM] = true;
					collision1.overlapY[BOTTOM] = overlap;

					//set body 2
					collision2.cardinality[TOP] = true;
					collision2.overlapY[TOP] = overlap;
				}
				//handle if body1.renderY == body2.renderY
				else{
					//this is a left / right collision, handled above
				}

				//console.log("collided");

				body1.addCollisionID(body2.objectID);
				body2.addCollisionID(body1.objectID);

				body1.addCollision(body2.objectID, collision1);
				body2.addCollision(body1.objectID, collision2);

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
			body.resetCollision();
			body.moved = false;

			//check contact with ground
			checkContactWithGround(body);

			body.collisions = body.getCollisions();
			body.collisionIDs = body.getCollisionIDs();
			//console.log(body.collisions);
			//console.log(body.collisionIDs.length);

			//if > 1 collision : means with ground
			if(body.collisionIDs.length > 0){
				for(var j = 0; j < body.collisionIDs.length; j++){
					var c = body.collisions[ body.collisionIDs[j] ];
					//console.log(c);

					if(c.cardinality[TOP]){
						body.setBlockedUp();
						if(body.getVecY() > 0){
							body.setVecY(0);
						}
					}
					if(c.cardinality[BOTTOM]){
						body.setBlockedDown();
						if(body.getVecY() < 0){
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

			body.renderX += body.getVecX();
			body.renderY += body.getVecY();
			moved = body.getVecX() != 0 || body.getVecY() != 0;

			body.setVecX(0);

			//apply gravity
			if(body.getVecY() < 0){
				body.setVecY( body.getVecY() + Gravity);
			}
			else{
				body.setVecY(Gravity);
			}

			
			body.setNumGroundCollisions(body.collisions.length);
			body.setBodyCollisionIndex(body.collisions.length - 1);

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
			for(var j = body.bodyCollisionIndex; j < body.collisions.length ; j++){
				var c = body.collisions[j];
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
								b2.setRenderX ( body2.getRenderX() + 0.5 * o);
							}
							//< ok 
							else if(!body.getBlockedLeft()  && b2.getBlockedRight()){
								body.setRenderX( body.getRenderX() - o);
							}
							//> ok
							else if(body.getBlockedLeft()  && !b2.getBlockedRight()){
								b2.setRenderX( body2.getRenderX() + o);
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
								b2.renderX = body2.renderX - 0.5 * o;
							}
							//< ok 
							else if(body.getBlockedRight()  && !b2.getBlockedLeft()){
								b2.renderX = body2.renderX - o;
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