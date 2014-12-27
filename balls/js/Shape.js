function Shape(x,y, audio, canvas) {
	this.audio = audio;
	this.canvas = canvas;

	this.position = new Vector(x, y);

	// Random velocity
	var dx = parseInt(Math.random() * 20) - 10,
	    dy = parseInt(Math.random() * 20) - 10;
	this.velocity = new Vector(dx,dy);

	// Downward acceleration
	this.acceleration = new Vector(0, 1.0);

	this.color = new Color();
}

Shape.prototype = {
	// RENDERING
	draw: function(context) {
		context.fillStyle = this.color.toString();
		context.beginPath();

		// Heart
		/*
		var rad2 = this.radius / 2;
		var leftx = this.position.x - rad2;
		var lefty = this.position.y - rad2;
		var rightx = this.position.x + rad2;
		var righty = this.position.y - rad2;
		context.arc(leftx, lefty, rad2, Math.PI * 1, Math.PI * 2);
		context.arc(rightx, righty, rad2, Math.PI * 1, Math.PI * 2);
		context.moveTo(leftx - rad2, this.position.y - rad2);
		context.lineTo(this.position.x, this.position.y + this.radius);
		context.lineTo(rightx + rad2, this.position.y - rad2);
		*/

		// 4-circles
		/*
		var rad2 = this.radius / 2;
		context.arc(this.position.x - rad2, this.position.y - rad2, this.radius / 2, 0, Math.PI * 2);
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(this.position.x + rad2, this.position.y - rad2, this.radius / 2, 0, Math.PI * 2);
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(this.position.x - rad2, this.position.y + rad2, this.radius / 2, 0, Math.PI * 2);
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(this.position.x + rad2, this.position.y + rad2, this.radius / 2, 0, Math.PI * 2);
		context.fill();
		context.closePath();
		*/

		// Circle
		//context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		//context.fill();
	},

	// POSITION
	tick: function(canvas) {
		this.color.tick();
		this.velocity.translate(this.acceleration);
		this.position.translate(this.velocity);
	},

}
