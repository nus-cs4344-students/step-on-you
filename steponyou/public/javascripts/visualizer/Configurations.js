'use strict';

var Configurations = {
	canvasWidth: 800,
	canvasHeight: 600,
	characterWidth: 50,
	characterHeight: 50,
	
	KEYWORD_UPDATE: "update",
	KEYWORD_CREATE: "create",
	KEYWORD_REMOVE: "remove"
};

var ASSET_PREFIX = 'images/';
var ASSET_LIST = {
	background: 'background3.jpg',
	character_devil: 'Character_Devil.png',
	character_angel: 'Character_Angel.png',
	character_green: 'Character_Green.png',
	character_white: 'Character_White.png'
};

function AssetManager(assetList) {
  this.assetList = (!assetList) ? ASSET_LIST : assetList;
}

AssetManager.prototype.load = function(callback) {
	var loadedImages = 0;
	var numImages = 0;
	// get num of sources
	for(var src in this.assetList) {
	  numImages++;
	}
	for(var src in this.assetList) {
	  this[src] = new Image();
	  this[src].onload = function() {
		if(++loadedImages >= numImages) {
		  callback();
		}
	  };
	  this[src].src = ASSET_PREFIX + this.assetList[src];
	}
};