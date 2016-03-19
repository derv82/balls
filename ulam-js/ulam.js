(function() {
    var self = this;
    var spirals = [];

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    self.a = 5;
    self.b = 5;
    self.currentAngleIncrement = 0.7;
    function redraw() {
        spirals.splice(0, spirals.length);
        context.fillStyle = "rgba(0,0,0,1.0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        spirals.push(new Spiral(canvas.width / 2, canvas.height / 2, self.a, self.b, self.currentAngleIncrement));
    };

    var plusButton = document.getElementById("plus");
    plusButton.onclick = function() {
        self.currentAngleIncrement += 0.01;
        redraw();
    };

    var minusButton = document.getElementById("minus");
    minusButton.onclick = function() {
        self.currentAngleIncrement -= 0.01;
        redraw();
    };
    redraw();

    function updateSpirals() {
        /*
        context.fillStyle = "rgba(0,0,0,0.01)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        */
        for (var i = 0; i < spirals.length; i++) {
            spirals[i].tick();
            spirals[i].draw();
            if (spirals[i].done()) {
                console.log("done");
                spirals.splice(i, 1);
                i--;
            }
        }
    }

    setInterval(updateSpirals, 1);

    function Spiral(x, y, a, b, angleIncrement) {
        this.centerX = x, this.centerY = y;
        this.lastX = x; this.lastY = y;
        this.a = a || 1, this.b = b || 1;
        this.angleIncrement = angleIncrement || 0.5;
        this.angleSegment = 0;
        this.done = function() {
            return (this.angleSegment >= 360);
        };
        this.tick = function() {
            this.angleSegment++;
        };
        this.draw = function() {
            context.beginPath();
            context.strokeStyle = "#fff";
            context.moveTo(this.lastX, this.lastY);

            angle = this.angleIncrement * this.angleSegment;
            this.lastX = this.centerX + (this.a + this.b * angle) * Math.cos(angle);
            this.lastY = this.centerY + (this.a + this.b * angle) * Math.sin(angle);

            context.lineTo(this.lastX, this.lastY);
            context.stroke();

            if (isPrime(this.angleSegment)) {
                context.beginPath();
                context.strokeStyle = "#f00";
                context.fillStyle = "#0f0";
                context.arc(this.lastX, this.lastY, 20, 0, 2 * Math.PI, false);
                context.fill();
                context.stroke();

                context.font = "20px serif";
                var width = context.measureText(this.angleSegment).width;
                context.strokeText(this.angleSegment, this.lastX - (width / 2), this.lastY + 7);
            } else {
                context.beginPath();
                context.strokeStyle = "#0ff";
                context.fillStyle = "#444";
                context.arc(this.lastX, this.lastY, 10, 0, 2 * Math.PI, false);
                context.fill();
                context.stroke();

                context.font = "10px serif";
                var width = context.measureText(this.angleSegment).width;
                context.strokeText(this.angleSegment, this.lastX - (width / 2), this.lastY + 2);
            }
        };
        return this;
    }

    function isPrime(n) {
        if (n == 2) {
            return true;
        } else if (n % 2 == 0) {
            return false;
        }
        var sqrtN = Math.ceil(Math.sqrt(n));
        for (var i = 3; i <= sqrtN; i += 2) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }
})();
