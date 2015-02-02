function Obj (visual, id, x, y) {
	this.presentation = visual; //this is the visual which store in the Kinetic Layer
	this.id = id;
	this.x = x;
	this.y = y;
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