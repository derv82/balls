
function Shape(x,y) {
	this.radius = 50; //(parseInt(Math.random() * 5) + 1) * 10,

	this.position = new Vector(x, y);

	// Random velocity
	var dx = parseInt(Math.random() * 50) - 10,
	    dy = parseInt(Math.random() * 50) - 10;
	this.velocity = new Vector(dx,dy);

	// Downward acceleration
	this.acceleration = new Vector(0, 0.1);

	this.color = new Color();
}

Shape.prototype = {
	// RENDERING
	draw: function(context) {
		context.fillStyle = this.color.toString();
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	},

	// POSITION
	tick: function(canvas) {
		this.color.tick();

		this.velocity.x += this.acceleration.x;
		this.velocity.y += this.acceleration.y;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
