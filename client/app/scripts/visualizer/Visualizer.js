function Visualizer () {
	this.stage = new Kinetic.Stage({
        container: 'gameCanvas',
        width: Configurations.canvasWidth,
        height: Configurations.canvasHeight
      });
	
	this.backgroundLayer = new Kinetic.Layer();
	this.objectLayer = new Kinetic.Layer();
	this.stage.add(this.backgroundLayer);
	this.stage.add(this.objectLayer);
	this.objects = []; //index is ID of the object
}

Visualizer.prototype.init = function() {
	var backgroundObj = new Image();
	var backLayer = this.backgroundLayer;
	backgroundObj.onload = function() {
		var background = new Kinetic.Image({
			x: 0, y: 0,	image: backgroundObj, 
			width: Configurations.canvasWidth, height: Configurations.canvasHeight
		});
		// add the shape to the layer
		backLayer.add(background);
		backLayer.draw();
	  };
	  backgroundObj.src = Assets.background;
};

Visualizer.prototype.update = function (data) {
	if (data.type != Configurations.KEYWORD_UPDATE) {
		return;
	}
	var objects = data.objects;
	for	(i = 0; i < objects.length; i++) {
		var object = objects[i];
		if (object.type == Configurations.KEYWORD_UPDATE) {
			
		} if (object.type == Configurations.KEYWORD_CREATE) {
			this.createObject(object);
		} if (object.type == Configurations.KEYWORD_REMOVE) {
			
		}
	}
	this.objectLayer.draw();
}

Visualizer.prototype.createObject = function (object) {
	var charVisual = new Kinetic.Circle({
        x: object.x,
        y: object.y,
        radius: Configurations.characterHeight,
        fill: object.character
    });
	this.objectLayer.add(charVisual);
	var character = new Player(charVisual, object.id, object.x, object.y, object.id);
	this.objects[object.id] = character;
}

//test
Visualizer.prototype.test = function () {
	var t = this;
	$.getJSON("update.json", function(json) {
		t.update(json);
	});
}















