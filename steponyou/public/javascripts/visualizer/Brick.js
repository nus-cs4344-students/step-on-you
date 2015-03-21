function Brick (model) {
	var visual = new Kinetic.Rect({
		x: model.x, 
		y: model.y,
		width: model.width, 
		height: model.height,
		fill: 'red',
        stroke: 'black',
        strokeWidth: 1
	});
	this.parent.constructor.call(this, model, visual);
}
Brick.prototype = Object.create(Obj.prototype);
Brick.prototype.constructor = visualPlayer;
Brick.prototype.parent = Obj.prototype;