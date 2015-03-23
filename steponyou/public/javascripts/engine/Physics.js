
var phyBdCount = 0;
var TOP = 0;
var BOTTOM = 1;
var LEFT = 2;
var RIGHT = 3;

function Physics(gameEngine) {

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
		body.setVecX(0);
		body.setVecY(0);
		body.setAccY(0);
		body.setAccX(0);
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

	var checkCollision = function(body1, body2){
		
		console.log("here");

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
	
			//check movement along Y axis
			var Yinitial = body1.renderY;
			var Yfinal = body1.renderY + body1.getVecY();
			var Xinitial =body1.renderX;
			var Xfinal = body1.renderX + body1.getVecX();

			//check for overlapping ranges for possible interaction

			//check for overlapping x range
			if( body1.renderX + body1.getVecX() < body2.renderX + body2.width + body2.getVecX() && body1.renderX + body1.width + body1.getVecX() > body2.renderX + body2.getVecX()  &&
				//check for within y range
				  body1.renderY + body1.getVecY() <= body2.renderY + body2.height + body2.getVecY() && body1.renderY + body1.height + body1.getVecY() >= body2.renderY + body2.getVecY()){

			//check if it intersects top of body2 ("ground support style")
			//if not, allow fall through? - for possible future implementation of jumping downwards
			//+getVecY in case other body also moving
			if(Yinitial + body1.height <= body2.renderY + body2.getVecY() && Yfinal + body1.height >= body2.renderY + body2.getVecY() ){

				if(body1.isPlayer() && body2.isPlayer()){
					console.log("player 1 killed player 2");
					if(gameEngine.role == "server"){
						gameEngine.addPlayerScore(body1.objectID);
					}
					//if client
					else{


					}
				}

				overlap = (body2.renderY + body2.getVecY() ) - (body1.renderY + body1.height + body1.getVecY());
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

				//correct body1 and 2 positions
				//if body2 is ground
				if(body2.isStatic){
					//correct body1 position
					body1.renderY = body2.renderY - body1.height;
					body1.setVecY(0);
					console.log("no this?");
				}
				//if body2 is player
				//b1 passes though as it kills the player 2
				else{
					//correct body1 position
					body1.renderY = body1.renderY + body1.getVecY();
					
				}



			}
			//check if its a jumping but blocked-at top motion
			else if( Yinitial >= body2.renderY + body2.height + body2.getVecY() && Yfinal <= body2.renderY + body2.height + body2.getVecY()){

				if(body1.isPlayer() && body2.isPlayer()){
					console.log("player 2 killed player 1");

					if(gameEngine.role == "server"){
						gameEngine.addPlayerScore(body2.objectID);
					}
					//if client
					else{


					}
				}

				overlap = (body1.renderY + body1.getVecY() ) - (body2.renderY + body2.height + body2.getVecY());
				overlap = Math.abs(overlap);
				//set body 1
				collision1.cardinality[TOP] = true;
				collision1.overlapY[TOP] = overlap;
				body1.setBlockedUp();

				//set body 2
				collision2.cardinality[BOTTOM] = true;
				collision2.overlapY[BOTTOM] = overlap;
				body2.setBlockedDown();

				//correct body1 and 2 positions
				//if body2 is ground
				if(body2.isStatic){
					//correct body1 position
					body1.renderY = body2.renderY + body2.height;
					body1.setVecY(0);
				}
				//if body2 is player
				//should have been handled above
				else{
					console.log("put respawn here");
				}
			}
			//no Y collision, just add
			else{
				//body1.renderY += body1.getVecY();
			}

			//check X axis
			//check for left / right motion
			//check for right movement

			//right-left clash
			if( Xinitial + body1.width <= body2.renderX + body2.getVecX() && Xfinal + body1.width >= body2.renderX + body2.getVecX()){
				//right clash
				//correct positions
				body1.setVecX(0);

				overlap = body1.renderX + body1.width + body1.getVecX() - body2.renderX - body2.getVecX();
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

				if(body2.isStatic){
					body1.renderX = body2.renderX - body1.width;
				}
				//shift both bodies?
				else{
					/*
					body1.renderX = body1.renderX + 0.5 * overlap;
					body2.renderX = body2.renderX - 0.5 * gap;
					*/

					//naively make this body accomodate the other body
					body1.renderX = body2.renderX - body1.width;
					
				}
			}
			//check for left
			//left-right clash
			else if(Xinitial >= body2.renderX + body2.width+ body2.getVecX() && Xfinal < body2.renderX + body2.width+ body2.getVecX() ){
				overlap = body2.renderX + body2.width + body2.getVecX() - body1.renderX - body1.getVecX();
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

				//correct positions
				if(body2.isStatic){
					body1.renderX = body2.renderX + body2.width;
				}
				else{
					body1.renderX = body2.renderX + body2.width;
				}

			}
			else{
				//body1.renderX += body1.getVecX();
			}

		}

		body1.addCollisionID(body2.objectID);
		body2.addCollisionID(body1.objectID);

		body1.addCollision(body2.objectID, collision1);
		body2.addCollision(body1.objectID, collision2);


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



	this.step = function(){
		var body;
		for(var i = 0; i < physicObjects.length; i++){
			body = physicObjects[i];

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

			//reset collisions
			body.resetCollision();

			checkContactWithGround(body);
			checkContactWithOther(body);

			//move if not blocked
			//mvoe x axis if possible
			if( (body.getVecX() < 0 && !body.getBlockedLeft()) || (body.getVecX() > 0 && !body.getBlockedRight()) ){
				body.renderX += body.getVecX();
			}

			//Y axis movement
			if( (body.getVecY() < 0 && !body.getBlockedUp()) || (body.getVecY() > 0 && !body.getBlockedDown()) ){
				body.renderY += body.getVecY();
			}

		}

		//console.log("stepped");



	}




}