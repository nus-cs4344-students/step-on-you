function Score (model) {
	//add a group
	var groupVisual = new Kinetic.Group({
        x: model.x,
        y: model.y
      });

      var image = this.getImage(model.character);
      var height = Configurations.characterHeight;
      var scale =  height / image.height;

	var avata = new Kinetic.Rect({
		x: 10, 
		y: 10,
		width: image.width, 
		height: image.height,
		fillPatternImage: image,
		fillPatternRepeat: 'no-repeat',
		scale: {x: scale, y: scale},
	});

	var frame = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: image.width * scale * 3,
		height: height + 20,
		cornerRadius: 20,
		fill: 'black',
		opacity: 0.3
	});

	this.scoreText = new Kinetic.Text({
        x: 80,
        y: 20,
        text: '',
        fontSize: height * 0.75,
        fontFamily: 'Roboto',
        fill: 'white'
      });

	groupVisual.add(frame);
	groupVisual.add(avata);
	groupVisual.add(this.scoreText);

	this.parent.constructor.call(this, model, groupVisual);
}
Score.prototype = Object.create(Obj.prototype);
Score.prototype.constructor = visualPlayer;
Score.prototype.parent = Obj.prototype;

Score.prototype.updateScore = function(score) {
	this.scoreText.setText(score);
};

Score.prototype.getImage = function (imgName) {
	if (imgName == "devil") {
		return assets.character_devil;
	} else if (imgName == "angel") {
		return assets.character_angel;
	} else if (imgName == "chicken") {
		return assets.character_chicken;
	} else if (imgName == "green") {
		return assets.character_green;
	} else if (imgName == "white") {
		return assets.character_white;
	}
};