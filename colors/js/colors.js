var $canvas, context;

function init() {
	$canvas = $('#canvas');
	context = $canvas[0].getContext('2d');
	context.fillStyle = 'rgb(255,0,0)';
	context.strokeStyle = 'rgb(255,0,0)';
	context.lineWidth = 10;
}

function resize() {
	context.canvas.width  = $(window).width() - 110;
	context.canvas.height = $(window).height();
	$('.colorChooser').height( $(window).height() / $('.colorChooser').size());
}

function main() {
	init();

	$(window).resize(resize);

	$canvas.bind('touchstart mousedown', function(evt) {
		context.lineWidth = 10;
		context.beginPath();
		context.moveTo(evt.clientX - 5, evt.clientY);
		context.lineTo(evt.clientX + 5, evt.clientY);
		context.stroke();
		context.moveTo(evt.clientX, evt.clientY);
		return false;
	});

	$canvas.bind('touchmove mousemove', function(evt) {
		if (evt.buttons != 1) {
			return;
		}
		context.lineTo(evt.clientX, evt.clientY);
		context.stroke();
		context.moveTo(evt.clientX, evt.clientY);
	});

	$canvas.bind('touchend mouseup', function(evt) {
		context.closePath();
	});

	$('.colorChooser').click(function(evt) {
		$('.colorChooser').removeClass('selected');
		$(this).addClass('selected');
		context.strokeStyle = $(this).css('background-color');
	});
}

function Point(x,y) {
	this.x = x;
	this.y = y;
}
Point.prototype = {
	toString: function() {
		return '(' + x + ',' + y + ')';
	},
};

$(document).ready(function() {
	main();
	resize();
	$('#colorRed').click();
});
