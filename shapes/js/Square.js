/* Extends Shape.js */
function Square(x, y, w, h, color) {
	Shape.call(this, x, y, color);
	this.width = Math.min(w,h);
	this.height = this.width;
	this.soundUrl = './sounds/square.wav';
}

Square.prototype = Object.create(Shape.prototype);
Square.prototype.constructor = Square;

Square.prototype.toString = function() {
	return "Square";
};

Square.prototype.draw = function(context) {
	context.save();
	context.fillStyle = this.color.toString();
	context.beginPath();
	context.translate(this.x + this.width / 2, this.y + this.width / 2);
	context.rotate(this.rotation);
	context.fillRect(-this.width  / 2,
	                 -this.width / 2,
									  this.width,
									  this.width);
	context.closePath();
	context.restore();
};

Square.prototype.animate = function(context) {
	this.rotation += this.rotationAmount;
};
