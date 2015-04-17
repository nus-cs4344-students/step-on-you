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
	this.jumpFlag = {};
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
	this.objectLayer.removeChildren();
	this.coverLayer.removeChildren();
	this.objects = {};
	this.scoreObj = {};
	this.redCover.opacity(0);
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
	this.coverLayer.draw();
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
		//update jumping status
		if (this.jumpFlag[object.id] == false && data.y < object.y) {
			this.jumpFlag[object.id] = true;
			//document.getElementById('audio_jump').play();
		} else if (this.jumpFlag[object.id] == true && data.y >= object.y) {
			this.jumpFlag[object.id] = false;
		}
		object.updatePossition(data.x, data.y);
	}

	//update score
	var scoreObj = this.scoreObjects[data.character];
	scoreObj.updateScore(data.score);
};

Visualizer.prototype.createObject = function (object) {
	this.removeObject(object.id);
	var player = new visualPlayer(object);
	this.objectLayer.add(player.presentation);	
	this.objects[object.id] = player;
	this.jumpFlag[object.id] = false;
	//set reswap effect
	if (this.objects[object.id].isLocal === true) {
		this.redCover.opacity(0);
		//update score board
		var scoreObj = this.scoreObjects[object.character];
		scoreObj.setLocal();
	}

	//update audio
	document.getElementById('audio_reswap').play();
};

Visualizer.prototype.removeObject = function(id) {
	if (this.objects[id] == null) {
		return;
	}
	//set dead effect
	if (this.objects[id].isLocal == true) {
		this.redCover.opacity(0.5);
		document.getElementById('audio_dead').play();
	}

	//remove visual
	var oldVisual = this.objects[id].presentation;
	var currentX = this.objects[id].x;
	var currentY = this.objects[id].y;
	//dead animation
	var tween = new Kinetic.Tween({
		node: oldVisual, 
		duration: 0.2,
		x: currentX + 25,
		y: currentY - 100,
		opacity: 0.66,
		scaleX: 0,
		onFinish: function() {
			var tween2 = new Kinetic.Tween({
				node: oldVisual, 
				duration: 0.2,
				x: currentX,
				y: currentY - 200,
				opacity: 0.33,
				scaleX: 0.3,
				onFinish: function() {
					var tween3 = new Kinetic.Tween({
						node: oldVisual, 
						duration: 0.2,
						x: currentX + 25,
						y: currentY - 300,
						opacity: 0,
						scaleX: 0.01,
						onFinish: function() {
							oldVisual.remove();
						}
					});
					tween3.play();
				}
			});
			tween2.play();
		}
	});
	tween.play();

	//remove model
	delete this.objects[id];

	//update audio
	document.getElementById('audio_land').play();
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