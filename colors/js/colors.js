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
	$('.colorChooser.selected').click();
}

var asdf = null;
function main() {
	init();

	$(window).resize(resize);

	$canvas.bind('touchstart mousedown', function(evt) {
		context.lineWidth = 10;
		context.beginPath();
		var x = evt.pageX - canvas.offsetLeft,
		    y = evt.pageY - canvas.offsetTop;
		context.moveTo(x - 5, y);
		context.lineTo(x + 5, y);
		context.stroke();
		context.moveTo(x, y);
		asdf = true;
	});

	$canvas.bind('mousemove', function(evt) {
		if (asdf == null) {
			return;
		}
		var x = evt.pageX - canvas.offsetLeft,
		    y = evt.pageY - canvas.offsetTop;
		context.lineTo(x, y);
		context.stroke();
		context.moveTo(x, y);
	});

	$canvas.bind('touchmove', function(evt) {
		if (asdf == null) {
			return;
		}
		if (!evt) {
			var evt = event;
		}
		evt.preventDefault();
		if (evt.originalEvent) {
			evt = evt.originalEvent;
		}
		if (evt.targetTouches) {
			evt = evt.targetTouches[0];
		}
		var x = evt.pageX - canvas.offsetLeft,
		    y = evt.pageY - canvas.offsetTop;
		context.lineTo(x, y);
		context.stroke();
		context.moveTo(x, y);
	});

	$canvas.bind('touchend touchcancel mouseup', function(evt) {
		asdf = null;
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
