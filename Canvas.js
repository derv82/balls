
function Canvas(canvasID) {
	this.element = $('#' + canvasID)[0];
	this.context = this.element.getContext("2d");
	this.audio = new SoundPlayer([
			{
				url: './sounds/billiard2.wav',
				name: 'billiard'
			},
			{
				url: './sounds/blip2.wav',
				name: 'blip'
			},
		]);

	this.background = new Background();
	this.shapes = new Shapes(this.audio, this.element);
	
	var thisCanvas = this; // For reference within inner functions below

	// RESIZE
	$(window).resize(function() {
		thisCanvas.element.width  = $(window).width();
		thisCanvas.element.height = $(window).height();
	});
	$(window).resize();

	// KEYPRESS
	$(window).keypress(function(event) {
		thisCanvas.background.flash(255,0,255);
		if (event.charCode == 32) {
			thisCanvas.shapes.clear();
		}
		else {
			thisCanvas.addShape();
		}
	});

	// MOUSE / TOUCH
	$("#canvas").swipe({
		tap: function(event, target) {
			thisCanvas.background.flash(255,0,255);
			thisCanvas.addShape(event.pageX, event.pageY);

			// Play sound during human interaction (for iOS)
			if (!$(window).data("hasPlayedSound")) {
				$(window).data("hasPlayedSound", true);
				thisCanvas.audio.play("blip", 1.0, 0);
			}
		},

		doubleTap: function(event, target) {
			thisCanvas.background.flash(255,0,255);
			thisCanvas.shapes.clear();
		},

		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			var v;
			// Get direction of swipe
			if        (direction === "up")    { v = new Vector( 0, -1);
			} else if (direction === "down")  { v = new Vector( 0,  1);
			} else if (direction === "left")  { v = new Vector(-1,  0);
			} else if (direction === "right") { v = new Vector( 1,  0); }
			// Extend direction based on distance swiped
			v = v.multiply(Math.max(20, thisCanvas.element.width / distance));
			// Push all balls in this direction
			for (var i in thisCanvas.shapes.shapes) {
				thisCanvas.shapes.shapes[i].velocity = thisCanvas.shapes.shapes[i].velocity.add(v);
			}
		},
		// Distance threshold to differentiate taps and swipes
		threshold: 10,
	});
}

Canvas.prototype = {
	addShape: function(x,y) {
		if (x === undefined) x = Math.random() * this.element.width;
		if (y === undefined) y = Math.random() * this.element.height;
		return this.shapes.addShape(x,y);
	},

	tick: function() {
		this.background.tick();
		this.background.draw(this.element, this.context);

		this.shapes.tick(this.element);
		this.shapes.draw(this.context);
	},

	loop: function() {
		var thisCanvas = this;
		setInterval(function() {
			thisCanvas.tick();
		}, 50);
	},
}

$(window).ready(function() {
	var canvas = new Canvas("canvas");

	var s;
	s = canvas.addShape(50, 150);
	s.velocity     = new Vector(23,0);
	s.acceleration = new Vector(0,0);

	s = canvas.addShape(650, 175);
	s.velocity     = new Vector(0,0);
	s.acceleration = new Vector(0,0);

	/*
	var NUM_BALLS = 10;
	for (var i = 0; i < NUM_BALLS; i++) {
		var s = canvas.addShape(i * canvas.element.width / NUM_BALLS, 0);
		s.position.x += s.radius / 2;
		s.position.y = canvas.element.height - s.radius;
		s.velocity = new Vector(0,0);
	}
	canvas.shapes.shapes[0].velocity.x = 5;
	*/
	canvas.loop();
});
