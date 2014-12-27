// Functions on a set of shapes

function Shapes(audio, canvas) {
	this.shapes = new Array();
	this.audio = audio;
	this.canvas = canvas;
}

Shapes.prototype = {
	addShape: function(x, y) {
		var shape;
		shape = new Circle(x, y, this.audio, this.canvas);
		this.shapes.push(shape);
		return shape;
	},

	clear: function() {
		this.shapes = new Array();
	},

	tick: function(canvas) {
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].tick(canvas);
			this.shapes[i].collideWall(this.canvas, this.audio);

			for (var j = i + 1; j < this.shapes.length; j++) {
				this.shapes[i].collideShape(this.shapes[j]);
			}
		}
	},

	draw: function(context) {
		for (var i in this.shapes) {
			this.shapes[i].draw(context);
		}
	}
};
