/* Extends Shape.js */
function Rectangle(x, y, w, h, color) {
	Shape.call(this, x, y, color);
	this.width = w;
	this.height = h;
	this.soundUrl = './sounds/rectangle.wav';
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.toString = function() {
	return "Rectangle";
};

Rectangle.prototype.draw = function(context) {
	context.save();
	context.fillStyle = this.color.toString();
	context.beginPath();
	context.translate(this.x + this.width / 2, this.y + this.height / 2);
	context.rotate(this.rotation);
	context.fillRect(-this.width  / 2,
	                 -this.height / 4,
									  this.width,
										this.height / 2);
	context.closePath();
	context.restore();
};

Rectangle.prototype.animate = function(context) {
	this.rotation += this.rotationAmount;
};
