
function Canvas(canvasID) {
	this.element = $('#' + canvasID)[0];
	this.context = this.element.getContext("2d");
	this.audio = new SoundPlayer();

	this.background = new Background();
	this.shapes = new Shapes(this.audio, this.context);
	
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
		this.shapes.addShape(x,y);
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
		}, 100);
	},
}

$(window).ready(function() {
	var canvas = new Canvas("canvas");
	canvas.addShape();
	canvas.addShape();
	canvas.loop();
});
