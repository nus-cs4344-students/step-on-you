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
	this.objects = {}; //index is ID of the object
};

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
			this.updateObject(object);
		} if (object.type == Configurations.KEYWORD_CREATE) {
			this.createObject(object);
		} if (object.type == Configurations.KEYWORD_REMOVE) {
			this.removeObject(object.id);
		}
	}
	this.objectLayer.draw();
};

Visualizer.prototype.updateObject = function (data) {
	var object = this.objects[data.id];
	if (data.character != object.character) {
		this.createObject(data);
	} else {
		object.updatePossition(data.x, data.y);
	}
};

Visualizer.prototype.createObject = function (object) {
	this.removeObject(object.id);
	var player = new Player(object);
	this.objectLayer.add(player.presentation);	
	this.objects[object.id] = player;
};

Visualizer.prototype.removeObject = function(id) {
	if (this.objects[id] == null) {
		return;
	}
	//remove visual
	var oldVisual = this.objects[id].presentation;
	oldVisual.remove();
	//remove model
	delete this.objects[id];
};

Visualizer.prototype.insertImage = function (layer, imgName, X, Y) {
	var src;
	var W, H;
	if (imgName == "background") {
		src = ASSET_PREFIX + ASSET_LIST.background;
		W = Configurations.canvasWidth;
		H = Configurations.canvasHeight;
	}
	
	var img = new Image();
	img.onload = function() {
		kineticImg = new Kinetic.Image({
			x: X, y: Y,	image: img, 
			width: W, height: H
		});
		layer.add(kineticImg);
		layer.draw();
	};
	img.src = src;
};

//test
Visualizer.prototype.test = function () {
	var t = this;
	$.getJSON("update.json", function(json) {
		t.update(json);
	});
};

Visualizer.prototype.test2 = function () {
	var t = this;
	$.getJSON("update2.json", function(json) {
		t.update(json);
	});
};














