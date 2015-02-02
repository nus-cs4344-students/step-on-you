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
	this.insertImage(this.backgroundLayer, 'background', 0, 0);
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
	var visual = this.insertImage(this.objectLayer, object.character, object.x, object.y);
	var character = new Player(visual, object.id, object.x, object.y, object.id);
	this.objects[object.id] = character;
}

Visualizer.prototype.insertImage = function (layer, imgName, X, Y) {
	var src;
	var W, H;
	if (imgName == "background") {
		src = Assets.background;
		W = Configurations.canvasWidth;
		H = Configurations.canvasHeight;
	} else {
		W = Configurations.characterWidth;
		H = Configurations.characterHeight;
		if (imgName == "devil") {
			src = Assets.character_devil;
		} else if (imgName == "angel") {
			src = Assets.character_angel;
		} else if (imgName == "chicken") {
			src = Assets.character_chicken;
		} else if (imgName == "green") {
			src = Assets.character_green;
		} else if (imgName == "white") {
			src = Assets.character_white;
		}
	}
		
	var img = new Image();
	img.onload = function() {
		var kineticImg = new Kinetic.Image({
			x: X, y: Y,	image: img, 
			width: W, height: H
		});
		layer.add(kineticImg);
		layer.draw();
	};
	img.src = src;
	return img;
}

//test
Visualizer.prototype.test = function () {
	var t = this;
	$.getJSON("update.json", function(json) {
		t.update(json);
	});
}















