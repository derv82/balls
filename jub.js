var shapes = new Array();
var canvas = $('#canvas')[0];
var context = canvas.getContext('2d');

// Audio
var channel_max = 10;
var audiochannels = new Array();
for (a=0;a<channel_max;a++) {
	audiochannels[a] = new Array();
	audiochannels[a]['channel'] = new Audio();
	audiochannels[a]['finished'] = -1;
}

var background = {
	red: 77,
	green: 33,
	blue: 88,
	alpha: 0.1,
	flash: function(r,g,b) {
		this.red = r; this.green = g; this.blue = b;
		this.alpha = 1.0;
	},
	draw: function() {
		// Fade from whatever color it is to the defautl color
		rd = this.red - 77;
		rg = this.green - 33;
		rb = this.blue - 88;
		ra = this.alpha - 0.1;
		this.red   -= parseInt(rd / 10);
		this.green -= parseInt(rg / 10);
		this.blue  -= parseInt(rb / 10);
		this.alpha -= (ra / 10);
		context.fillStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')';
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
};

$(window).ready(function() {
	// Canvas dimensions
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	$(window).resize(function() {
		canvas.width = $(window).width();
		canvas.height = $(window).height();
	});

	// Keypress
	$(window).keypress(function(event) {
		background.flash(255,255,255);
		if (event.charCode == 32) {
			shapes = new Array();
		}
		else {
			addShape();
		}
	});
	// Click
	$(window).click(function(event) {
		background.flash(255,0,255);
		addShape(event.pageX, event.pageY);
		event.preventDefault();
	});

	// Shapes
	for (var i = 0; i < 1; i++) {
		addShape();
	}

	// Render loop
	setInterval( function() {
		background.draw();
		for (var i in shapes) {
			collisionDetection();
			shapes[i].tick();
			shapes[i].draw();
		}
	}, 10);
});

function addShape(x,y) {
	var shape = newShape(x,y);
	shapes.push(shape);
}

function newShape(x,y) {
	if (x === undefined) x = Math.random() * canvas.width;
	if (y === undefined) y = Math.random() * canvas.height;
	var shape = {
		// COLOR
		red: parseInt(Math.random() * 255),
		green: parseInt(Math.random() * 255),
		blue: parseInt(Math.random() * 255),
		color: function() {
			return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
		},
		// POSITION
		r: 50, //(parseInt(Math.random() * 5) + 1) * 10,
		x: x,
		y: y,
		// VELOCITY
		dx: parseInt(Math.random() * 20) - 10,
		dy: parseInt(Math.random() * 20) - 10,
		dr: parseInt(Math.random() * 20) - 10,
		db: parseInt(Math.random() * 20) - 10,
		dg: parseInt(Math.random() * 20) - 10,
		// Acceleration
		ddy: 0.1,
		// RENDER
		draw: function() {
			context.fillStyle = this.color();
			context.beginPath();
			context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		},
		tick: function() {
			nextColor(this);
			nextPosition(this);
		}
	};
	return shape;
}

/**
 * Iterates shape's x/y values to the next logical values.
 */
function nextPosition(shape) {
	shape.dy += shape.ddy;
	shape.x += shape.dx;
	shape.y += shape.dy;
	// Top/Left
	if (shape.x - shape.r < 0) {
		shape.x = shape.r;
		shape.dx = -shape.dx;
	}
	if (shape.y - shape.r < 0) {
		shape.y = shape.r;
		shape.dy = -shape.dy;
	}
	// Bottom/Right
	if (shape.x + shape.r > canvas.width) {
		shape.x = canvas.width - shape.r;
		shape.dx = -shape.dx;
	}
	if (shape.y + shape.r > canvas.height) {
		shape.y = canvas.height - shape.r;
		shape.dy = -shape.dy;
	}
}

/**
 * Iterates shape's RGB values to the next logical values.
 */
function nextColor(shape) {
	// Red
	shape.red += shape.dr;
	if (shape.red >= 255 || shape.red <= 0) {
		shape.dr = -shape.dr;
	}
	if (shape.red < 0)   shape.red = 0;
	if (shape.red > 255) shape.red = 255;
	// Green
	shape.green += shape.dg;
	if (shape.green >= 255 || shape.green <= 0) {
		shape.dg = -shape.dg;
	}
	if (shape.green < 0)   shape.green = 0;
	if (shape.green > 255) shape.green = 255;
	// Blue
	shape.blue += shape.db;
	if (shape.blue >= 255 || shape.blue <= 0) {
		shape.db = -shape.db;
	}
	if (shape.blue < 0)   shape.blue = 0;
	if (shape.blue > 255) shape.blue = 255;
}

function collisionDetection() {
	var obj1, obj2;

	for (var i = 0; i < shapes.length - 1; i++) {
		obj1 = shapes[i];

		for (var j = i + 1; j < shapes.length; j++) {
			obj2 = shapes[j];
			// Check if obj1 collides with obj2
			var dx = obj2.x - obj1.x,
			    dy = obj2.y - obj1.y,
					d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			if (d < obj1.r + obj2.r) {
				// Note: borrowed heavily from http://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769
				// Colliding!
				var collisionPointX = ((obj1.x * obj2.r) + (obj2.x * obj1.r)) / (obj1.r + obj2.r);
				var collisionPointY = ((obj1.y * obj2.r) + (obj2.y * obj1.r)) / (obj1.r + obj2.r);
				context.fillStyle = 'rgb(255,0,0)';
				context.beginPath();
				context.arc(collisionPointX, collisionPointY, 5, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
				// Bounce!
				// Doesn't take angles into account
				// Assumes objects already exist (aren't placed "on top of" one another)
				var dx1 = (obj1.dx * (obj1.r - obj2.r) + (2 * obj2.r * obj2.dx)) / (obj1.r + obj2.r);
				var dy1 = (obj1.dy * (obj1.r - obj2.r) + (2 * obj2.r * obj2.dy)) / (obj1.r + obj2.r);
				var dx2 = (obj2.dx * (obj2.r - obj1.r) + (2 * obj1.r * obj1.dx)) / (obj2.r + obj1.r);
				var dy2 = (obj2.dy * (obj2.r - obj1.r) + (2 * obj1.r * obj1.dy)) / (obj2.r + obj1.r);
				// Set new velocities
				obj1.dx = dx1; obj1.dy = dy1;
				obj1.dx = dx1; obj1.dy = dy1;
				obj2.dx = dx2; obj2.dy = dy2;
				obj2.dx = dx2; obj2.dy = dy2;
				// Bump position towards new velocities
				obj1.x += obj1.dx;
				obj1.y += obj1.dy;
				obj2.x += obj2.dx;
				obj2.y += obj2.dy;
				playSound('billiard');
			}
		}
	}
}

// Taken from http://www.storiesinflight.com/html5/audio.html
function playSound(s) {
	for (a = 0;a < audiochannels.length; a++) {
		thistime = new Date();
		if (audiochannels[a]['finished'] < thistime.getTime()) {
			audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration * 1000;
			audiochannels[a]['channel'].src = document.getElementById(s).src;
			audiochannels[a]['channel'].load();
			audiochannels[a]['channel'].play();
			break;
		}
	}
}
