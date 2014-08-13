function Background() {
	this.red   = 77;
	this.green = 33;
	this.blue  = 88;
	this.alpha = 0.1;
}

Background.prototype = {
	// Change background color temporarily
	flash: function(r,g,b) {
		this.red = r; this.green = g; this.blue = b;
		this.alpha = 1.0;
	},

	tick: function() {
		// Fade from whatever color it is to the default color
		rd = this.red - 77;
		rg = this.green - 33;
		rb = this.blue - 88;
		ra = this.alpha - 0.1;
		this.red   -= parseInt(rd / 10);
		this.green -= parseInt(rg / 10);
		this.blue  -= parseInt(rb / 10);
		this.alpha -= (ra / 10);
	},

	draw: function(canvas, context) {
		context.fillStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')';
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

};

