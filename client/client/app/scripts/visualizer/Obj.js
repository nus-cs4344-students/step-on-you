function Obj (model, visual) {
	this.presentation = visual; //this is the visual which store in the Kinetic Layer
	this.id = model.id;
	this.x = model.x;
	this.y = model.y;
	this.width = model.width;
	this.height = model.height;
}

Obj.prototype.updatePossition = function (x, y) {
	this.x = x;
	this.y = y;
	this.presentation.setX(x);
	this.presentation.setY(y);
}

Obj.prototype.updatePresentation = function (visual) {
	this.presentation = visual;
}