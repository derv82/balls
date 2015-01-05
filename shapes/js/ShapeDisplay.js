function ShapeDisplay(shape, x, y, w, h, color) {
	this.shape = new shape(x, y, w, h, color);
	this.setX(x);
	this.setY(y);
	this.setWidth(w);
	this.setHeight(h);
	this.color = color;
}

ShapeDisplay.prototype = {
	draw: function(context) {
		context.save();
		context.beginPath();

		// Blank it first
		context.shadowColor = 'rgba(0,0,0,0)';
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect(this.x, this.y, this.width - 4, this.height - 4);

		// Bounding box
		var bgcolor = new Color(this.color.red, this.color.green, this.color.blue, 0.3);
		context.fillStyle = bgcolor.toString();
		context.fillRect(this.x, this.y, this.width - 4, this.height - 4);

		// Box outline
		context.strokeStyle = this.color.toString();
		context.lineWidth = 4;
		context.rect(this.x, this.y, this.width - 4, this.height - 4);
		context.stroke();

		// Inner shape
		context.shadowColor = 'rgb(0,0,0)';
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		this.shape.draw(context);

		// Text
		var fontsize = this.height / 120.0;
		context.shadowBlur = 1;
		context.font = 'Bold ' + fontsize + 'em Arial';
		context.textAlign = 'center';
		context.fillStyle = this.color.toString();
		context.fillText(this.shape.toString(),
				             this.x + this.width / 2,
										 this.y + this.height - this.height / 8)

		context.closePath();
		context.restore();
	},

	animate: function(context) {
		this.shape.animate(context);
	},

	setX: function(x) {
		this.x = x;
		this.shape.x = x + this.width / 4;
	},
	setY: function(y) {
		this.y = y;
		this.shape.y = y + this.height / 8;
	},
	setWidth: function(width) {
		this.width = width;
		this.shape.width = width / 2;
	},
	setHeight: function(height) {
		this.height = height;
		this.shape.height = height / 2;
	},
};
