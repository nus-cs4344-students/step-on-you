function Visualizer () {
	this.stage = new Kinetic.Stage({
		container: 'gameCanvas',
		width: Configurations.canvasWidth,
		height: Configurations.canvasHeight
	});
	
	this.backgroundLayer = new Kinetic.Layer();
	this.objectLayer = new Kinetic.Layer();
	this.coverLayer = new Kinetic.Layer();
	this.stage.add(this.backgroundLayer);
	this.stage.add(this.objectLayer);
	this.stage.add(this.coverLayer);
	
	this.objects = {}; //index is ID of the object
	this.scoreObjects = {};
	this.redCover;
	this.insertImage(this.backgroundLayer, 'background', 0, 0);	
};

Visualizer.prototype.init = function() {
	this.redCover = new Kinetic.Rect({
		x: 0, 
		y: 0,
		width: Configurations.canvasWidth, 
		height: Configurations.canvasHeight,
		fill: 'red',
        	opacity: 0
	});
	this.coverLayer.add(this.redCover);

	var model = {character: 'angel', x: 25, y: 10};
	var score = new Score(model);
	this.coverLayer.add(score.presentation);
	this.scoreObjects['angel'] = score;

	model = {character: 'devil', x: 225, y: 10};
	score = new Score(model);
	this.coverLayer.add(score.presentation);
	this.scoreObjects['devil'] = score;

	model = {character: 'green', x: 425, y: 10};
	score = new Score(model);
	this.coverLayer.add(score.presentation);
	this.scoreObjects['green'] = score;

	model = {character: 'white', x: 625, y: 10};
	score = new Score(model);
	this.coverLayer.add(score.presentation);
	this.scoreObjects['white'] = score;

	this.coverLayer.draw();
};

Visualizer.prototype.reset = function() {
	this.objectLayer.clear();
	this.coverLayer.clear();
	this.object = {};
	this.scoreObj = {};
	// redCover.opacity(0);
	this.init();
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
			console.log("Remove player "+object.id);
		}
	}
	// console.log(this.objects);
	this.objectLayer.draw();
};

Visualizer.prototype.updateMap = function(bricks) {
	var objectLayer = this.objectLayer;
	bricks.forEach(function(element, index, array) {
		var brick = new Brick(element);
		objectLayer.add(brick.presentation);
		objectLayer.draw();
	});
};

Visualizer.prototype.updateObject = function (data) {
	var object = this.objects[data.id];
	if (object == null || data.character != object.character) {
		this.createObject(data);
	} else {
		object.updatePossition(data.x, data.y);
	}
	var scoreObj = this.scoreObjects[data.character];
	scoreObj.updateScore(data.score);
};

Visualizer.prototype.createObject = function (object) {
	this.removeObject(object.id);
	var player = new visualPlayer(object);
	this.objectLayer.add(player.presentation);	
	this.objects[object.id] = player;
	//set reswap effect
	if (this.objects[object.id].isLocal === true) {
		this.redCover.opacity(0);
		//update score board
		var scoreObj = this.scoreObjects[object.character];
		scoreObj.setLocal();
	}
};

Visualizer.prototype.removeObject = function(id) {
	if (this.objects[id] == null) {
		return;
	}
	//set dead effect
	if (this.objects[id].isLocal === 'true') {
		this.redCover.opacity(0.5);
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

Visualizer.prototype.setLocalPlayer = function(character) {
	this.localPlayer = character;
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















