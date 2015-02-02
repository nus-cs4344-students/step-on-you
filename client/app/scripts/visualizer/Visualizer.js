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
}

Visualizer.prototype.init = function() {
	this.loadBackground();
};

Visualizer.prototype.loadBackground = function() {
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
}