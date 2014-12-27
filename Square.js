/* Extends Shape */
function Square(x, y, audio, canvas) {
	Shape.call(this, x, y, audio, canvas);
	this.width = 100;
	this.height = 100;
	this.mass = 50;
}
Square.prototype = Object.create(Shape.prototype);
Square.prototype.constructor = Square;

Square.prototype.draw = function(context) {
	context.fillStyle = this.color.toString();
	context.beginPath();
	context.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
	context.closePath();
};

Square.prototype.collideWall = function(canvas, audio) {
	if (this.left() < 0) {
		this.position.x = this.width / 2;
		this.velocity.x = -this.velocity.x;
		this.audio.play("blip",
		                Math.abs(this.velocity.x / 2),
		                this.position.x / this.canvas.width - 0.5);
	}
	if (this.top() < 0) {
		this.position.y = this.height / 2;
		this.velocity.y = -this.velocity.y;
		this.audio.play("blip",
		                Math.abs(this.velocity.x / 2),
		                this.position.x / this.canvas.width - 0.5);
	}
	if (this.right() > canvas.width) {
		this.position.x = this.canvas.width - this.width / 2;
		this.velocity.x = -this.velocity.x;
		this.audio.play("blip",
		                Math.abs(this.velocity.x / 2),
		                this.position.x / this.canvas.width - 0.5);
	}
	if (this.bottom() > canvas.height) {
		this.position.y = this.canvas.height - this.height / 2;
		this.velocity.y = -this.velocity.y;
		if (Math.abs(this.velocity.y) > 1) {
			this.audio.play("blip",
			                Math.abs(this.velocity.y / 2),
			                this.position.x / this.canvas.width - 0.5);
		}
	}
}

Square.prototype.left   = function() { return this.position.x - this.width / 2;  }
Square.prototype.right  = function() { return this.position.x + this.width / 2;  }
Square.prototype.top    = function() { return this.position.y - this.height / 2; }
Square.prototype.bottom = function() { return this.position.y + this.height / 2; }

Square.prototype.collideShape = function(shape2) {
	if (shape2 instanceof Square) {
		if (this.left() > shape2.right()
		 || this.right() < shape2.left()
		 || this.top() > shape2.bottom()
		 || this.bottom() < shape2.top()) {
			// No collision
			return false;
		}

		// Collision
		/*
		shape2.velocity = new Vector(0,0);
		this.velocity = new Vector(0,0);
		//*/

		var invDiff = new Vector(this.velocity.y, -this.velocity.x).normalize();
		var minx = Math.abs(Math.min(this.left() - shape2.right(), this.right() - shape2.left()));
		var miny = Math.abs(Math.min(this.top() - shape2.bottom(), this.bottom() - shape2.top()));
		minx = minx / invDiff.x;
		miny = miny / invDiff.y;
		invDiff = invDiff.multiply(Math.max(minx, miny));
		this.position = this.position.add(invDiff);

		///*
		var vTemp = shape2.velocity.clone();
		shape2.velocity = this.velocity.clone();
		this.velocity = vTemp;
		//*/
	}
	else if (shape2 instanceof Circle) {
		Circle.collideSquare(shape2, this);
	}
}
