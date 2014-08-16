
function Canvas(canvasID) {
	this.element = $('#' + canvasID)[0];
	this.context = this.element.getContext("2d");
	this.audio = new SoundPlayer();

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

	// CLICK
	$(window).click(function(event) {
		thisCanvas.background.flash(255,0,255);
		thisCanvas.addShape(event.pageX, event.pageY);
		event.preventDefault();
	});
}

Canvas.prototype = {
	addShape: function(x,y) {
		if (x === undefined) x = Math.random() * this.element.width;
		if (y === undefined) y = Math.random() * this.element.height;
		return this.shapes.addShape(x,y);
	},

	tick: function() {
		this.background.draw(this.element, this.context);
		this.background.tick();

		this.shapes.draw(this.context);
		this.shapes.tick(this.element);
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
	var s = canvas.addShape(20, 150);
	s.velocity.y = 0;
	s.velocity.x = 5;
	s = canvas.addShape(400, 200);
	s.velocity.y = 0;
	s.velocity.x = 0;
	canvas.loop();
});
