function Shapes(audio, context) {
	this.shapes = new Array();
	this.collision = new Collision(audio,context);
}

Shapes.prototype = {
	addShape: function(x, y) {
		var shape = new Shape(x,y);
		this.shapes.push(shape);
		return shape;
	},

	clear: function() {
		this.shapes = new Array();
	},

	tick: function(canvas) {
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].tick(canvas);
		}
		for (var i = 0; i < this.shapes.length; i++) {
			this.collision.wall(this.shapes[i], canvas);

			for (var j = i + 1; j < this.shapes.length; j++) {
				this.collision.shape(this.shapes[i], this.shapes[j]);
			}
		}
	},

	draw: function(context) {
		for (var i in this.shapes) {
			this.shapes[i].draw(context);
		}
	}
};