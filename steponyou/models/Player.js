var Player = function(model, initialX, initialY, connID) {
	this.model = model;
	this.x = model.x; 
	this.y = model.y;
	this.connectionID = connID;
};
Player.prototype = Object.create(Obj.prototype);
Player.prototype.constructor = Player;
Player.prototype.parent = Obj.prototype;

