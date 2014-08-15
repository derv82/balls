
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

		var v1 = deltav.multiply(-1).normalize().multiply(shape2.velocity.subtract(shape1.velocity).length());
		var v2 = deltav.normalize().multiply(shape1.velocity.subtract(shape2.velocity).length());

		shape1.velocity = shape1.velocity.add(v1);
		shape2.velocity = shape2.velocity.add(v2);
		/*
		var v = shape1.velocity.subtract(shape2.velocity);
		var vn = v.dot(norm);

		var im1 = 1 / shape1.radius,
		    im2 = 1 / shape2.radius;
		var i = vn / (im1 + im2);
		var impulse = deltav.multiply(i);
		console.log(impulse.toString());

		shape1.velocity = shape1.velocity.add(impulse.multiply(im1));
    shape2.velocity = shape2.velocity.subtract(impulse.multiply(im2));
		*/

		/*
		var massSum = shape1.radius + shape2.radius;
		dn.normalize();
		var dt = new Vector(dn.y, -dn.x);
		// Shift shapes so they are not touching
		var mT = dn.multiply(shape1.radius + shape2.radius - distance);
		shape1.position.tx(mT);
		shape2.position.tx(mT.multiply(-1));

		var v1 = dn.multiply(shape1.velocity.dot(dn)).length();
		var v2 = dn.multiply(shape2.velocity.dot(dn)).length();

		shape1.velocity = dt.multiply(shape1.velocity.dot(dt));
		shape1.velocity.tx(dn.multiply((shape2.radius * (v2 - v1) + shape1.radius * v1 + shape2.radius * v2) / massSum));

		shape2.velocity = dt.multiply(shape2.velocity.dot(dt));
		shape2.velocity.tx(dn.multiply((shape1.radius * (v1 - v2) + shape2.radius * v2 + shape1.radius * v1) / massSum));
		shape1.position.tx(shape1.velocity);
		shape2.position.tx(shape2.velocity);
		*/

		// Note: borrowed heavily from http://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769
		var collisionPointX = ((shape1.position.x * shape2.radius) + (shape2.position.x * shape1.radius)) / (shape1.radius + shape2.radius);
		var collisionPointY = ((shape1.position.y * shape2.radius) + (shape2.position.y * shape1.radius)) / (shape1.radius + shape2.radius);

		this.context.fillStyle = 'rgb(255,0,0)';
		this.context.beginPath();
		this.context.arc(collisionPointX, collisionPointY, 5, 0, Math.PI * 2, true);
		this.context.closePath();
		this.context.fill();

		/*
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

		/*
		// Bump position towards new velocities
		shape1.position.x += shape1.velocity.x;
		shape1.position.y += shape1.velocity.y;
		shape2.position.x += shape2.velocity.x;
		shape2.position.y += shape2.velocity.y;
		*/

		//this.audio.play('billiard');
	},
}
