function Player (visual, id, x, y, character) {
	this.parent.constructor.call(this, visual, id, x, y);
	this.character = character;
}
Player.prototype = Object.create(Obj.prototype);
Player.prototype.constructor = Player;
Player.prototype.parent = Obj.prototype;