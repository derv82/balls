/* Extends Shape.js */
function Circle(x, y, w, h, color) {
	Shape.call(this, x, y, color);
	this.width = w;
	this.height = h;
	this.soundUrl = './sounds/circle.wav';
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.toString = function() {
	return "Circle";
};

Circle.prototype.draw = function(context) {
	context.fillStyle = this.color.toString();
	context.beginPath();
	context.arc(
			this.x + (this.width / 2),
			this.y + (this.height / 2),
			this.width / 2,
			0, 2 * Math.PI, false
		);
	context.fill();
	context.closePath();
};

Circle.prototype.animate = function(context) {
	this.rotation += this.rotationAmount;
};
