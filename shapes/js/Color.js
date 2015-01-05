function Color(r,g,b,a) {
	if (typeof(r) === 'undefined') r = parseInt(Math.random() * 255);
	if (typeof(g) === 'undefined') g = parseInt(Math.random() * 255);
	if (typeof(b) === 'undefined') b = parseInt(Math.random() * 255);
	this.red   = r;
	this.green = g;
	this.blue  = b;
	if (typeof(a) === 'undefined') a = 1.0;
	this.alpha = a;
}

Color.prototype = {
	toString: function() {
		return 'rgba(' + this.red + ','
		               + this.green + ','
		               + this.blue + ','
		               + this.alpha + ')';
	},
};
