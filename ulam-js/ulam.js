(function() {
    var self = this;

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var context = canvas.getContext("2d");

    self.a = 5;
    self.b = 5;
    self.angleIncrement = 0.5;

    self.scale = 1.0;

    self.PRIMES = {};
    self.isPrime = function(n) {
        var nStr = n.toString()
        if (self.PRIMES.hasOwnProperty(nStr)) {
            return self.PRIMES[nStr];
        }
        var result = true;
        if (n == 2) {
            result = true;
        } else if (n % 2 == 0) {
            result = false;
        } else {
            var sqrtN = Math.ceil(Math.sqrt(n));
            for (var i = 3; i <= sqrtN; i += 2) {
                if (n % i == 0) {
                    result = false;
                    break;
                }
            }
        }
        self.PRIMES[nStr] = result
        return result;
    };

    var FACTORS = {};
    self.numFactors = function(n) {
        var count = 1;
        for (var i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                count++;
            }
        }
        return count;
    };

    self.newSpiral = function() {
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.draw = function() {
            context.fillStyle = "rgba(0,0,0,1.0)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.fillStyle = "#fff";
            var text = "Scale: " + self.scale + "x\n";
            text += "a: " + self.a  + "\n";
            text += "b: " + self.b  + "\n";
            text += "i: " + self.angleIncrement + "\n";
            context.fillText(text, 100, 100);
            context.moveTo(this.centerX, this.centerY);

            var angle;
            for (var i = 2; i < 720; i++) {
                angle = i * self.angleIncrement;

                var newX = this.centerX + (self.scale * (self.a + self.b * angle) * Math.cos(angle));
                var newY = this.centerY + (self.scale * (self.a + self.b * angle) * Math.sin(angle));

                // Draw spiral line to next point.
                context.lineTo(newX, newY);
                context.strokeStyle = "rgba(0,255,255,0.3)";
                context.stroke();

                var strokeStyle, fillstyle, arcRadius, font, offsetY;
                var nfact = self.numFactors(i);
                if (nfact == 1) {
                    strokeStyle = "#444";
                    fillStyle = "#0aa";
                    arcRadius = 20 * self.scale;
                    fontSize = arcRadius + "px";
                    offsetY = (arcRadius / 2);
                } else {
                    strokeStyle = "#0aa";
                    fillStyle = "#444";
                    arcRadius = (nfact * 2) * self.scale;
                    fontSize = arcRadius + "px";
                    offsetY = 7 * self.scale;
                }

                // Draw the circle at this point
                context.beginPath();
                context.strokeStyle = strokeStyle;
                context.fillStyle = fillStyle;
                context.arc(newX, newY, arcRadius, 0, 2 * Math.PI, false);
                context.fill();
                context.stroke();

                // Insert number into circle
                context.fillStyle = "#fff";
                context.font = fontSize + " Consolas";
                var width = context.measureText(i).width;
                context.fillText(i, newX - (width / 2), newY + offsetY - (5 * self.scale));
            }
        };
        return this;
    };

    self.spiral = self.newSpiral();

    self.redraw = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        self.spiral.centerX = canvas.width / 2;
        self.spiral.centerY = canvas.height / 2;

        self.spiral.draw();
    };

    $(window).resize(self.redraw);

    self.redraw();

    self.speed = 0.00001;
    self.timer = setInterval(function() {
        self.angleIncrement += self.speed;
        redraw();
    }, 10);
    self.increment = 0.001;

    function speedUp() {
        self.speed += 0.0001;
        redraw();
    }
    document.getElementById("greaterThan").onclick = speedUp;

    function slowDown() {
        self.speed -= 0.0001;
        redraw();
    }
    document.getElementById("lessThan").onclick = slowDown;

    function halt() {
        self.speed = 0;
    }
    document.getElementById("stop").onclick = halt;

    function zoomIn() {
        self.scale /= 0.8;
    }
    document.getElementById("zoomIn").onclick = zoomIn;

    function zoomOut() {
        self.scale *= 0.8;
    }
    document.getElementById("zoomOut").onclick = zoomOut;

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                slowDown();
                break;
            case 39: // right
                speedUp();
                break;

            case 38: // up
                zoomIn();
                break;
            case 40: // down
                zoomOut();
                break;

            case 32: // space
            case 13: // Enter
                halt();
                break;
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
})();
