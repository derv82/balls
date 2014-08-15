
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

		var deltav = new Vector(shape2.position.x - shape1.position.x,
		                        shape2.position.y - shape1.position.y);
		var distance = deltav.length();

		// If distance is less than sum of radii, no collision
		if (distance > shape1.radius + shape2.radius) {
			// No collision
			 return;
		}

		var norm = deltav.normalize();
		// Move 2nd shape so it is not colliding
		var delta2 = norm.multiply(shape1.radius + shape2.radius);
		shape2.position = shape1.position.add(delta2);

		var mv1 = ((shape1.radius - shape2.radius) / (shape1.radius + shape2.radius)) * shape1.velocity.length() + 
			        ((2 * shape2.radius)             / (shape1.radius + shape2.radius)) * shape2.velocity.length();

		var mv2 = ((shape2.radius - shape1.radius) / (shape2.radius + shape1.radius)) * shape1.velocity.length() + 
			        ((2 * shape1.radius)             / (shape2.radius + shape1.radius)) * shape1.velocity.length();

		var v1 = deltav.multiply(-1).normalize().multiply(shape2.velocity.subtract(shape1.velocity).length());
		var v2 = deltav.normalize().multiply(shape1.velocity.subtract(shape2.velocity).length());

		v1 = shape1.velocity.add(v1).normalize().multiply(mv1);
		v2 = shape2.velocity.add(v2).normalize().multiply(mv2);

		shape1.velocity = v1;
		shape2.velocity = v2;

		this.audio.play('billiard');
	},
}
