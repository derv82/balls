/* Extends Shape.js */
function Triangle(x, y, w, h, color) {
	Shape.call(this, x, y, color);
	this.width = w;
	this.height = h;
	this.soundUrl = './sounds/triangle.wav';
}

Triangle.prototype = Object.create(Shape.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.toString = function() {
	return "Triangle";
};

Triangle.prototype.draw = function(context) {
	context.save();
	context.fillStyle = this.color.toString();
	context.beginPath();
	context.translate(this.x + this.width / 2, this.y + this.height / 2);
	context.rotate(this.rotation);
	context.moveTo(0,
			           -this.height / 2);
	context.lineTo(-this.width / 2, this.height / 2);
	context.lineTo(this.width / 2, this.height / 2);
	context.fill();
	context.closePath();
	context.restore();
};

Triangle.prototype.animate = function(context) {
	this.rotation += this.rotationAmount;
};
