/* Extends Shape */
function Circle(x,y, audio, canvas) {
	Shape.call(this, x, y, audio, canvas);
	this.radius = 50;
	this.mass = this.radius;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.draw = function(context) {
	context.fillStyle = this.color.toString();
	context.beginPath();
	context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
	context.fill();
};

Circle.prototype.collideWall = function() {
	// Left wall
	if (this.position.x - this.radius < 0) {
		this.position.x = this.radius;
		this.velocity.x = -this.velocity.x;
		this.audio.play("blip",
		                Math.abs(this.velocity.x / 2),
		                this.position.x / this.canvas.width - 0.5);
	}
	// Top wall
	if (this.position.y - this.radius < 0) {
		this.position.y = this.radius;
		this.velocity.y = -this.velocity.y;
		this.audio.play("blip",
		                Math.abs(this.velocity.x / 2),
		                this.position.x / this.canvas.width - 0.5);
	}
	// Right wall
	if (this.position.x + this.radius > this.canvas.width) {
		this.position.x = this.canvas.width - this.radius;
		this.velocity.x = -this.velocity.x;
		this.audio.play("blip",
		                Math.abs(this.velocity.x / 2),
		                this.position.x / this.canvas.width - 0.5);
	}
	// Bottom wall
	if (this.position.y + this.radius > this.canvas.height) {
		this.position.y = this.canvas.height - this.radius;
		this.velocity.y = -this.velocity.y;
		if (Math.abs(this.velocity.y) > 1) {
			this.audio.play("blip",
			                Math.abs(this.velocity.y / 2),
			                this.position.x / this.canvas.width - 0.5);
		}
	}
};

Circle.prototype.collideShape = function(shape2) {
	if (shape2 instanceof Circle) {
		////////////////////////////////////////////////
		// Line between the centers of this and shape2
		var deltav = new Vector(shape2.position.x - this.position.x,
		                        shape2.position.y - this.position.y);

		var radiiSum = this.radius + shape2.radius;
		// If distance is less than sum of radii, no collision
		if (deltav.length() > radiiSum) {
			// No collision
			 return;
		}

		/////////////////////////////////////////////////
		// Move 2nd shape so it is not colliding
		var delta2 = deltav.normalize()         // Convert line between shapes to have length 1
		                   .multiply(radiiSum); // Extend to the line to the distance between shapes
		shape2.position = this.position.add(delta2); // Move 2nd shape

		/////////////////////////////////////////////////
		// The rest is *heavily* borrowed from:
		//   http://www.vobarian.com/collisions/2dcollisions2.pdf
		// This is a great guide for resolving collisions with vectors and no trigonometry.
		// (by projecting velocity along vectors normal/tangent to the collision).

		var massSum = this.mass + shape2.mass;

		/////////////////////////////////////
		// Calculate the Normal & Tangent vectors
		var vectorUnitNormal = deltav.normalize();   // Direction: From this to shape2
		var vectorUnitTangent = new Vector(-vectorUnitNormal.y, vectorUnitNormal.x); // Direction: Perpendicular to the Normal
		// *Unit means length is 1
		
		var volume = deltav.subtract(this.velocity.normalize()).length() / 2;

		///////////////////////////////////////////////////////
		// Calculate the pre-collision velocity of shapes along
		// both the normal and tangent unit vectors.
		// This is done by "projecting" each velocity onto the normal/tangent vectors
		var scalarNormalBefore1  = vectorUnitNormal.dot(this.velocity);
		var scalarNormalBefore2  = vectorUnitNormal.dot(shape2.velocity);
		var scalarTangentBefore1 = vectorUnitTangent.dot(this.velocity);
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
		      scalarNormalBefore1 * (this.mass - shape2.mass)
		      +                 2 * shape2.mass * scalarNormalBefore2
		    )
		    / massSum;
		var scalarNormalAfter2
		  = (
		      scalarNormalBefore2 * (shape2.mass - this.mass)
		      +                 2 * this.mass * scalarNormalBefore1
		    )
		    / massSum;

		// Create the post-collision velocity vectors (extensions of the normal/tangent)
		var vectorNormalAfter1  = vectorUnitNormal.multiply(scalarNormalAfter1);
		var vectorNormalAfter2  = vectorUnitNormal.multiply(scalarNormalAfter2);
		var vectorTangentAfter1 = vectorUnitTangent.multiply(scalarTangentAfter1);
		var vectorTangentAfter2 = vectorUnitTangent.multiply(scalarTangentAfter2);

		var velBefore = this.velocity;

		// Add these vectors together to get the final velocities
		this.velocity   = vectorNormalAfter1.add(vectorTangentAfter1);
		shape2.velocity = vectorNormalAfter2.add(vectorTangentAfter2);

		////////////////////////////////////
		// Play a sound.
		// Calculate magnitude of change in volume
		var volume = velBefore.subtract(this.velocity).length();
		this.audio.play("billiard", volume, this.position.x / this.canvas.width - 0.5);
	}
	else if (shape2 instanceof Square) {
		Circle.collideSquare(this, shape2);
	}
};

Circle.collideSquare = function(circle, square) {
	// Resolve circle->square collision
};
