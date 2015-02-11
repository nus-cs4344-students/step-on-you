function Visualizer () {
	// create an new instance of a pixi stage
	this.stage = new PIXI.Stage(Configurations.colors.background);
};

Visualizer.prototype.init = function() {
	// create a renderer instance.
	var gameView = document.getElementById('gameCanvas');
	this.renderer = PIXI.autoDetectRenderer(Configurations.canvasWidth, Configurations.canvasHight, gameView);
	//start rendering
	requestAnimFrame( animate );
	function animate() {
	    requestAnimFrame( animate );
	    renderer.render(this.stage);
	}
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















