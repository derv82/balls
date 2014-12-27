// Functions for detecting and resolving collisions

function Collision(audio, canva) {
	this.audio   = audio;
	this.canvas  = canvas;
}

Collision.prototype = {
	// Checks for and resolves collisions between a shape and a wall
	wall: function(shape) {
		// Left wall
		if (shape.position.x - shape.radius < 0) {
			shape.position.x = shape.radius;
			shape.velocity.x = -shape.velocity.x;
			this.audio.play("blip",
			                Math.abs(shape.velocity.x / 2),
			                shape.position.x / this.canvas.width - 0.5);
		}
		// Top wall
		if (shape.position.y - shape.radius < 0) {
			shape.position.y = shape.radius;
			shape.velocity.y = -shape.velocity.y;
			this.audio.play("blip",
			                Math.abs(shape.velocity.y / 2),
			                shape.position.x / this.canvas.width - 0.5);
		}
		// Right wall
		if (shape.position.x + shape.radius > this.canvas.width) {
			shape.position.x = this.canvas.width - shape.radius;
			shape.velocity.x = -shape.velocity.x;
			this.audio.play("blip",
			                Math.abs(shape.velocity.x / 2),
			                shape.position.x / this.canvas.width - 0.5);
		}
		// Bottom wall
		if (shape.position.y + shape.radius > this.canvas.height) {
			shape.position.y = this.canvas.height - shape.radius;
			shape.velocity.y = -shape.velocity.y;
			if (shape.velocity.y > 1) {
				this.audio.play("blip",
				                Math.abs(shape.velocity.y / 2),
				                Shape.position.x / this.canvas.width - 0.5);
			}
		}
	},

	// Checks for a resolves collisions between two shapes
	shape: function(shape1, shape2) {

		////////////////////////////////////////////////
		// Line between the centers of shape1 and shape2
		var deltav = new Vector(shape2.position.x - shape1.position.x,
		                        shape2.position.y - shape1.position.y);

		var radiiSum = shape1.radius + shape2.radius;
		// If distance is less than sum of radii, no collision
		if (deltav.length() > radiiSum) {
			// No collision
			 return;
		}

		/////////////////////////////////////////////////
		// Move 2nd shape so it is not colliding
		var delta2 = deltav.normalize()         // Convert line between shapes to have length 1
		                   .multiply(radiiSum); // Extend to the line to the distance between shapes
		shape2.position = shape1.position.add(delta2); // Move 2nd shape

		/////////////////////////////////////////////////
		// The rest is *heavily* borrowed from:
		//   http://www.vobarian.com/collisions/2dcollisions2.pdf
		// This is a great guide for resolving collisions with vectors and no trigonometry.
		// (by projecting velocity along vectors normal/tangent to the collision).

		var massSum = shape1.mass + shape2.mass;

		/////////////////////////////////////
		// Calculate the Normal & Tangent vectors
		var vectorUnitNormal = deltav.normalize();   // Direction: From shape1 to shape2
		var vectorUnitTangent = new Vector(-vectorUnitNormal.y, vectorUnitNormal.x); // Direction: Perpendicular to the Normal
		// *Unit means length is 1
		
		var volume = deltav.subtract(shape1.velocity.normalize()).length() / 2;

		///////////////////////////////////////////////////////
		// Calculate the pre-collision velocity of shapes along
		// both the normal and tangent unit vectors.
		// This is done by "projecting" each velocity onto the normal/tangent vectors
		var scalarNormalBefore1  = vectorUnitNormal.dot(shape1.velocity);
		var scalarNormalBefore2  = vectorUnitNormal.dot(shape2.velocity);
		var scalarTangentBefore1 = vectorUnitTangent.dot(shape1.velocity);
		var scalarTangentBefore2 = vectorUnitTangent.dot(shape2.velocity);

		// Calculate post-collision velocity along the tangent vector
		// Note: This does not change as it's tangential to the collision
		var scalarTangentAfter1 = scalarTangentBefore1;
		var scalarTangentAfter2 = scalarTangentBefore2;

		// Calculate the magnitude of the post-collision velocity along the normal vector
		///////////////////////////////////////////////////////////////////////////////
		//                                                                           //
		//                       v1Before * (mass1 - mass2) + 2 * mass2 * v2Before   //
		// v1AlongNormalAfter =  -------------------------------------------------   //
		//                                     mass1 + mass2                         //
		//                                                                           //
		///////////////////////////////////////////////////////////////////////////////
		// This gives the magnitude of the post-collision velocity along the normal vector
		var scalarNormalAfter1
		  = (
		      scalarNormalBefore1 * (shape1.mass - shape2.mass)
		      +                 2 * shape2.mass * scalarNormalBefore2
		    )
		    / massSum;
		var scalarNormalAfter2
		  = (
		      scalarNormalBefore2 * (shape2.mass - shape1.mass)
		      +                 2 * shape1.mass * scalarNormalBefore1
		    )
		    / massSum;

		// Create the post-collision velocity vectors (extensions of the normal/tangent)
		var vectorNormalAfter1  = vectorUnitNormal.multiply(scalarNormalAfter1);
		var vectorNormalAfter2  = vectorUnitNormal.multiply(scalarNormalAfter2);
		var vectorTangentAfter1 = vectorUnitTangent.multiply(scalarTangentAfter1);
		var vectorTangentAfter2 = vectorUnitTangent.multiply(scalarTangentAfter2);

		var velBefore = shape1.velocity;

		// Add these vectors together to get the final velocities
		shape1.velocity = vectorNormalAfter1.add(vectorTangentAfter1);
		shape2.velocity = vectorNormalAfter2.add(vectorTangentAfter2);

		////////////////////////////////////
		// Play a sound.
		// Calculate magnitude of change in volume
		var volume = velBefore.subtract(shape1.velocity).length();
		this.audio.play("billiard", volume, shape1.position.x / this.canvas.width - 0.5);
	},


}
