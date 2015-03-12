module.exports = function Player(model, initialX, initialY, connID){
	this.model = model;
	this.x = initialX; 
	this.y = initialY;
	this.connectionID = connID;
	this.status = 0;//Alive
}
