var $canvas, context;
var shapes = [];
var audio;

function init() {
	$canvas = $('#canvas');
	context = $canvas[0].getContext('2d');

	//                             Shape       X    Y   Width Height     Color
	shapes.push( new ShapeDisplay( Square,     50,  50,  150,  150,  new Color(255,0,0) ) );
	shapes.push( new ShapeDisplay( Circle,    200,  50,  150,  150,  new Color(0,255,0) ) );
	shapes.push( new ShapeDisplay( Triangle,   50, 200,  150,  150,  new Color(50,50,255) ) );
	shapes.push( new ShapeDisplay( Rectangle, 200, 200,  150,  150,  new Color(0,255,255) ) );

	// Initialize sounds
	soundObj = []
	for (var i in shapes) {
		soundObj.push({
			name: shapes[i].shape.toString(),
			url: shapes[i].shape.soundUrl
		});
	}
	audio = new SoundPlayer(soundObj);

	$canvas.mousedown(function(event) {
		var x = event.pageX - $canvas[0].offsetLeft;
		var y = event.pageY - $canvas[0].offsetTop;

		var rowlen = shapes.length / 2;
		var xindex = parseInt((x / context.canvas.width)  * rowlen);
		var yindex = parseInt((y / context.canvas.height) * rowlen);
		var shape = shapes[xindex * rowlen + yindex];

		try {
			audio.play(shape.shape.toString(), 50);
		} catch (e) {
			console.log(e);
		}
		for (var i = 0; i < 64; i++) {
			setTimeout(function() {
				shape.animate(context);
				shape.draw(context);
			}, i * 20);
		}
		resize();
	});

	$(window).resize(resize);
}

function main() {
	init();
	$(window).resize();
}

function resize() {
	context.canvas.width  = $(window).width();
	context.canvas.height = $(window).height();

	var rowlen = 2;
	var collen = shapes.length / 2;
	var cellWidth = context.canvas.width / rowlen;
	var cellHeight = context.canvas.height / collen;
	for (var i = 0; i < shapes.length; i++) {
		shapes[i].setX(parseInt(i / collen) * cellWidth);
		shapes[i].setY(parseInt(i % collen) * cellHeight);
		shapes[i].setWidth(cellWidth);
		shapes[i].setHeight(cellHeight);
	}

	for (var i in shapes) {
		shapes[i].draw(context);
	}
}

$(document).ready(function() {
	main();
});
