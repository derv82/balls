
function Collision(audio, context) {
	this.audio   = audio;
	this.context = context;
}

Collision.prototype = {
	// Checks for and resolves collisions between a shape and a wall
	wall: function(shape, canvas) {
		// Left wall
		if (shape.position.x - shape.radius < 0) {
			shape.position.x = shape.radius;
			shape.velocity.x = -shape.velocity.x;
		}
		// Top wall
		if (shape.position.y - shape.radius < 0) {
			shape.position.y = shape.radius;
			shape.velocity.y = -shape.velocity.y;
		}
		// Right wall
		if (shape.position.x + shape.radius > canvas.width) {
			shape.position.x = canvas.width - shape.radius;
			shape.velocity.x = -shape.velocity.x;
		}
		// Bottom wall
		if (shape.position.y + shape.radius > canvas.height) {
			shape.position.y = canvas.height - shape.radius;
			shape.velocity.y = -shape.velocity.y;
		}
	},

	// Checks for a resolves collisions between two shapes
	shape: function(shape1, shape2) {
		// Distance between shapes
		var dx = shape2.position.x - shape1.position.x,
				dy = shape2.position.y - shape1.position.y,
				d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		// If distance is less than sum of radii, collision!
		if (d < shape1.radius + shape2.radius) {
			// Note: borrowed heavily from http://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769
			// Colliding!
			var collisionPointX = ((shape1.position.x * shape2.radius) + (shape2.position.x * shape1.radius)) / (shape1.radius + shape2.radius);
			var collisionPointY = ((shape1.position.y * shape2.radius) + (shape2.position.y * shape1.radius)) / (shape1.radius + shape2.radius);

			this.context.fillStyle = 'rgb(255,0,0)';
			this.context.beginPath();
			this.context.arc(collisionPointX, collisionPointY, 5, 0, Math.PI * 2, true);
			this.context.closePath();
			this.context.fill();

			// Bounce!
			// Doesn't take angles into account
			// Assumes shapeects already exist (aren't placed "on top of" one another)
			var dx1 = (shape1.velocity.x * (shape1.radius - shape2.radius) + (2 * shape2.radius * shape2.velocity.x)) / (shape1.radius + shape2.radius);
			var dy1 = (shape1.velocity.y * (shape1.radius - shape2.radius) + (2 * shape2.radius * shape2.velocity.y)) / (shape1.radius + shape2.radius);
			var dx2 = (shape2.velocity.x * (shape2.radius - shape1.radius) + (2 * shape1.radius * shape1.velocity.x)) / (shape2.radius + shape1.radius);
			var dy2 = (shape2.velocity.y * (shape2.radius - shape1.radius) + (2 * shape1.radius * shape1.velocity.y)) / (shape2.radius + shape1.radius);
			// Set new velocities
			shape1.velocity.x = dx1; shape1.velocity.y = dy1;
			shape1.velocity.x = dx1; shape1.velocity.y = dy1;
			shape2.velocity.x = dx2; shape2.velocity.y = dy2;
			shape2.velocity.x = dx2; shape2.velocity.y = dy2;
			// Bump position towards new velocities
			/*
			shape1.position.x += shape1.velocity.x;
			shape1.position.y += shape1.velocity.y;
			shape2.position.x += shape2.velocity.x;
			shape2.position.y += shape2.velocity.y;
			*/
			this.audio.play('billiard');
		}
	},
}
