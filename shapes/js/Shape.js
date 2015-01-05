function Shape(x,y,color) {
	this.x = x;
	this.y = y;
	this.color = color || new Color();
	this.rotation = 0;
	this.rotationAmount = Math.PI / 32;
}

Shape.prototype = {
	draw: function(context) {
		throw Error("Need to implement draw() for this Shape");
	},
	toString: function() {
		throw Error("Need to implement toString() for this Shape");
	},
};
