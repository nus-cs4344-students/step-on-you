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



	// var canvas1 = this.backgroundLayer.getCanvas();
	// context1 = canvas1.getContext('2d');
	// var canvas2 = this.objectLayer.getCanvas();
	// context1 = canvas2.getContext('2d');

 //    // resize the canvas to fill browser window dynamically
 //    window.addEventListener('resize', resizeCanvas, false);

 //    function resizeCanvas() {
 //    	canvas1.width = window.innerWidth;
 //    	canvas1.height = window.innerHeight;
 //    	canvas2.width = window.innerWidth;
 //    	canvas2.height = window.innerHeight;
 //    	that.init();
 //    }
 //    resizeCanvas();
};

Visualizer.prototype.init = function() {
	this.insertImage(this.backgroundLayer, 'background', 0, 0);
};

Visualizer.prototype.update = function (data) {
	if (data.packageType != Configurations.KEYWORD_UPDATE) {
		return;
	}
	var objects = data.objects;
	for	(i = 0; i < objects.length; i++) {
		var object = objects[i];
		if (object.updateType == Configurations.KEYWORD_UPDATE) {
			this.updateObject(object);
		} if (object.updateType == Configurations.KEYWORD_REMOVE) {
			this.removeObject(object.id);
		}
	}
	this.objectLayer.draw();
};

Visualizer.prototype.updateObject = function (data) {
	var object = this.objects[data.id];
	if (object == null || data.character != object.character) {
		this.createObject(data);
	} else {
		object.updatePossition(data.x, data.y);
	}
};

Visualizer.prototype.createObject = function (object) {
	this.removeObject(object.id);
	var player = new visualPlayer(object);
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















