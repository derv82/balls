// Canvas background functions
function Background(r, g, b, a) {
	this.color = new Color(r || this.BASE_COLOR.red,
	                       g || this.BASE_COLOR.green,
	                       b || this.BASE_COLOR.blue,
	                       a || this.BASE_COLOR.alpha);
}

Background.prototype = {
	// Default background color
	BASE_COLOR: new Color(77, 33, 88, 0.1),

	// Change background color temporarily
	flash: function(r,g,b) {
		this.color = new Color(r, g, b, 1.0);
	},

	tick: function() {
		// Fade from whatever color it is to the default color
		rd = this.color.red   - this.BASE_COLOR.red;
		rg = this.color.green - this.BASE_COLOR.green;
		rb = this.color.blue  - this.BASE_COLOR.blue;
		ra = this.color.alpha - this.BASE_COLOR.alpha;
		this.color.red   -= parseInt(rd / 10);
		this.color.green -= parseInt(rg / 10);
		this.color.blue  -= parseInt(rb / 10);
		this.color.alpha -= (ra / 10);
	},

	draw: function(canvas, context) {
		context.fillStyle = this.color.toString();
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

};

