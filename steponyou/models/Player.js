module.exports = function Player(playerID, connID, model, initialX, initialY){
	this.model = model;
	this.x = initialX; 
	this.y = initialY;
	this.connectionID = connID;
	this.id = playerID;
	this.status = 3;//0:Alive and in a game room 1:Dead 2:Connection closed(in 15s buffer time) 3:active but not in any game room
}
