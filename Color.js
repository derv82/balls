function Color(r,g,b,a) {
	this.red   = r || parseInt(Math.random() * 255);
	this.green = g || parseInt(Math.random() * 255);
	this.blue  = b || parseInt(Math.random() * 255);
	this.alpha = a || 1.0;

	// COLOR VELOCITY
	this.dred   = parseInt(Math.random() * 20) - 10;
	this.dgreen = parseInt(Math.random() * 20) - 10;
	this.dblue  = parseInt(Math.random() * 20) - 10;
}

Color.prototype = {
	toString: function() {
		return 'rgba(' + this.red + ','
		               + this.green + ','
		               + this.blue + ','
		               + this.alpha + ')';
	},

	// Iterate to next color
	tick: function() {
		this.red += this.dred;
		if (this.red >= 255) {
			this.red  = 255;
			this.dred = -this.dred;
		} else if (this.red <= 0) {
			this.red = 0;
			this.dred = -this.dred;
		}

		this.green += this.dgreen;
		if (this.green >= 255) {
			this.green  = 255;
			this.dgreen = -this.dgreen;
		} else if (this.green <= 0) {
			this.green = 0;
			this.dgreen = -this.dgreen;
		}

		this.blue += this.dblue;
		if (this.blue >= 255) {
			this.blue  = 255;
			this.dblue = -this.dblue;
		} else if (this.blue <= 0) {
			this.blue = 0;
			this.dblue = -this.dblue;
		}
	}
}
