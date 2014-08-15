
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
		var unitNormal = deltav.normalize();   // Direction: From shape1 to shape2
		var unitTangent = new Vector(-unitNormal.y, unitNormal.x); // Direction: Perpendicular to the Normal
		// *Unit means length is 1

		///////////////////////////////////////////////////////
		// Calculate the pre-collision velocity of shapes along
		// both the normal and tangent unit vectors.
		// This is done by "projecting" each velocity onto the normal/tangent vectors
		var v1NormalBefore  = unitNormal.dot(shape1.velocity);
		var v2NormalBefore  = unitNormal.dot(shape2.velocity);
		var v1TangentBefore = unitTangent.dot(shape1.velocity);
		var v2TangentBefore = unitTangent.dot(shape2.velocity);

		// Calculate post-collision velocity along the tangent vector
		// Note: This does not change as it's tangential to the collision
		var v1TangentAfter = v1TangentBefore;
		var v2TangentAfter = v2TangentBefore;

		// Calculate the magnitude of the post-collision velocity along the normal vector
		///////////////////////////////////////////////////////////////////////////////
		//                                                                           //
		//                       v1Before * (mass1 - mass2) + 2 * mass2 * v2Before   //
		// v1AlongNormalAfter =  -------------------------------------------------   //
		//                                     mass1 + mass2                         //
		//                                                                           //
		///////////////////////////////////////////////////////////////////////////////
		// This gives the magnitude of the post-collision velocity along the normal vector
		var v1NormalAfter = (
		                      v1NormalBefore * (shape1.mass - shape2.mass)
		                      +            2 * shape2.mass * v2NormalBefore
		                    )
		                    / massSum;
		var v2NormalAfter = (
		                      v2NormalBefore * (shape2.mass - shape1.mass)
		                      +            2 * shape1.mass * v1NormalBefore
		                    )
		                    / massSum;

		// Create the post-collision velocity vectors (extensions of the normal/tangent)
		var v1NormalVectorAfter  = unitNormal.multiply(v1NormalAfter);
		var v2NormalVectorAfter  = unitNormal.multiply(v2NormalAfter);
		var v1TangentVectorAfter = unitTangent.multiply(v1TangentAfter);
		var v2TangentVectorAfter = unitTangent.multiply(v2TangentAfter);

		// Add these vectors together to get the final velocities
		shape1.velocity = v1NormalVectorAfter.add(v1TangentVectorAfter);
		shape2.velocity = v2NormalVectorAfter.add(v2TangentVectorAfter);

		// Play a sound.
		this.audio.play('billiard');
	},


}
