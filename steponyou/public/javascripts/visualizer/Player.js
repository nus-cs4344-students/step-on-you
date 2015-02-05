function Player (model) {
	var image = this.getImage(model.character);
	var scale = Configurations.characterHeight / image.height;
	var visual = new Kinetic.Rect({
		x: model.x, 
		y: model.y,
		width: image.width, 
		height: image.height,
		fillPatternImage: image,
		fillPatternRepeat: 'no-repeat',
		scale: {x: scale, y: scale},
	});
	this.parent.constructor.call(this, model, visual);
	this.character = model.character;
}
Player.prototype = Object.create(Obj.prototype);
Player.prototype.constructor = Player;
Player.prototype.parent = Obj.prototype;

Player.prototype.getImage = function (imgName) {
	if (imgName == "devil") {
		return assets.character_devil;
	} else if (imgName == "angel") {
		return assets.character_angel;
	} else if (imgName == "chicken") {
		return assets.character_chicken;
	} else if (imgName == "green") {
		return assets.character_green;
	} else if (imgName == "white") {
		return assets.character_white;
	}
};