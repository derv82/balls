
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

		// Line between origins of shape1 and shape2
		var deltav = new Vector(shape2.position.x - shape1.position.x,
		                        shape2.position.y - shape1.position.y);

		var radiiSum = shape1.radius + shape2.radius;

		// If distance is less than sum of radii, no collision
		if (deltav.length() > radiiSum) {
			// No collision
			 return;
		}

		///////////////////////////////////////
		// Move 2nd shape so it is not colliding
		var delta2 = deltav.normalize()         // Convert line between shapes to have length 1
		                   .multiply(radiiSum); // Extend to the line to the distance between shapes
		shape2.position = shape1.position.add(delta2);

		//////////////////////////////////////
		// Calculate magnitude of the final velocities using Conservation of Momentum
		//
		//           (mass1 - mass2)                  (2 * mass2)
		// v2Final = --------------- * v1Before  +  --------------- * v2Before
		//           (mass1 + mass2)                (mass1 + mass2)
		//
		var magVel1 = ((shape1.radius - shape2.radius) / radiiSum) * shape1.velocity.length() + 
			            ((2 * shape2.radius)             / radiiSum) * shape2.velocity.length();

		var magVel2 = ((shape2.radius - shape1.radius) / radiiSum) * shape1.velocity.length() + 
			            ((2 * shape1.radius)             / radiiSum) * shape1.velocity.length();


		//////////////////////////////////////
		// Calculate direction of new velocities
		var dirVel1 = deltav.multiply(-1) // Invert line (now points from shape2 to shape1)
		                    .normalize()  // Convert to length 1
		                    .multiply(    // Multiply by difference of velocities
		                        shape2.velocity.subtract(shape1.velocity)
		                                       .length()
		                    );

		var dirVel2 = deltav.normalize() // Convert line between shapes to 1
		                    .multiply(   // Multiply by difference of velocities
		                        shape1.velocity.subtract(shape2.velocity)
		                                       .length()
		                    );

		shape1.velocity = shape1.velocity.add(dirVel1)       // Add direction of velocity to existing
		                                                     // velocity to get new direction
		                                 .normalize()        // Convert to length 1
		                                 .multiply(magVel1); // Extend to the length of the new velocity

		shape2.velocity = shape2.velocity.add(dirVel2)       // Add direction of velocity to existing
		                                                     // velocity to get new direction
		                                 .normalize()        // Convert to length 1
		                                 .multiply(magVel2); // Extend to the length of the new velocity

		this.audio.play('billiard');
	},
}
