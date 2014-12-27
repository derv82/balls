// From http://jsbin.com/otipiv/152/

/** Represents a line vector (with x & y positions) */
function Vector(x,y) {
	this.x = x;
	this.y = y;
}

Vector.prototype = {
	dot: function (v) {
		return this.x * v.x + this.y * v.y;
	},

	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	normalize: function() {
		var s = 1 / this.length();
		return new Vector(this.x * s, this.y * s);
	},

	multiply: function(s) {
		return new Vector(this.x * s, this.y * s);
	},

	// Adds vector
	translate: function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

	add: function(v) {
		return new Vector(this.x + v.x, this.y + v.y);
	},

	subtract: function(v) {
		return new Vector(this.x - v.x, this.y - v.y);
	},

	toString: function() {
		return "Vector(" + this.x + "," + this.y + ")";
	},

	clone: function() {
		return new Vector(this.x, this.y);
	}
}
