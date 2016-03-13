
var MIN_PARTICLES = 20, MAX_PARTICLES = 30;
var MAX_RADIUS = 200;

$(document).ready(function() {
    function randomColor(opacity) {
        return Math.floor(Math.random() * 175) + 25 + 55;
    };

    var Canvas = function() {
        this.element = document.getElementById("canvas");
        this.context = this.element.getContext("2d");
        this.resize = function() {
            this.element.width = window.innerWidth;
            this.element.height = window.innerHeight;
        };
        return this;
    }();

    var Sky = function(Canvas) {
        var self = this;
        this.fireworks = [];
        this.newFirework = function(e) {
            var fw = new Firework(e.clientX, e.clientY, 2);
            self.fireworks.push(fw);
            fw.draw(Canvas.context); // Render immediately (don't wait for tick)
        };
        this.draw = function() {
            Canvas.context.fillStyle = "rgba(0,0,0,0.2)";
            Canvas.context.fillRect(0, 0, Canvas.element.width, Canvas.element.height);
            for (var i = 0; i < self.fireworks.length; i++) {
                self.fireworks[i].draw(Canvas.context);
                if (self.fireworks[i].done()) {
                    self.fireworks.splice(i, 1);
                    i--;
                }
            }
        };
        Canvas.element.onclick = this.newFirework;
        return this;
    }(Canvas);

    var Firework = function(x, y, depth, first, delay, acceleration, size, dx, dy, red, green, blue) {
        var self = this;
        // Position / Directoin
        self.x = x;
        self.y = y;
        self.dx = dx || 0;
        self.dy = dy || 0;
        self.acceleration = acceleration || (Math.floor(Math.random() * 5) + 5);
        self.size = size || 10;

        // Color
        self.red   = red   || randomColor();
        self.green = green || randomColor();
        self.blue  = blue  || randomColor();
        self.fade = 1.0;
        self.delta_fade = Math.random() * 0.01;
        self.color = function() {
            return 'rgba(' + self.red +
                       ',' + self.green +
                       ',' + self.blue +
                       ',' + self.fade +
                       ')';
        };

        // Time delay before appearing
        self.delay = delay || 0;
        self.ticksUntilDraw = self.delay;

        // Recursive depth
        self.depth = depth || 0;
        if (first === undefined) {
            self.first = (first === undefined);
        }

        self.createSubparticles = function() {
            if (self.depth == 0) {
                // No subparticles
                self.particle_count = 0;
                self.particles = [];
            } else if (self.depth > 0) {
                // Create subparticles
                self.particle_count = Math.floor(Math.random() * (MAX_PARTICLES - MIN_PARTICLES)) + MIN_PARTICLES;
                self.particles = new Array(self.particle_count);
                for (var i = 0; i < self.particles.length; i++) {
                    var theta = i * (Math.PI * 2) / self.particle_count;
                    var pdx = (1.5 * self.dx) + Math.sin(theta) * self.acceleration;
                    var pdy = (1.5 * self.dy) + Math.cos(theta) * self.acceleration;
                    var px = self.x;// + self.acceleration * Math.sin(theta);
                    var py = self.y; // + self.acceleration * Math.cos(theta);
                    self.particles[i] = new Firework(px, py,      // Position
                            self.depth - 1,                       // Recursion depth
                            false,                                // First Particle
                            0, //self.delay + 3,                           // Delay (in ticks)
                            self.acceleration * 2.0,
                            self.size * 0.7,
                            pdx, pdy,                             // Velocity/Direction
                            //undefined,undefined,undefined);
                            self.red, self.green, self.blue);     // Color
                }
            }
        };

        self.draw = function(context) {
            self.dx = self.dx * 0.99;
            self.x += self.dx;
            self.dy = self.dy + 0.5;
            self.y += self.dy;
            // Tick appearance
            if (self.ticksUntilDraw > 0) {
                self.ticksUntilDraw--;
                return;
            }
            if (self.ticksUntilDraw == 0) {
                self.ticksUntilDraw = -1;
                self.createSubparticles();
            }
            self.fade -= self.delta_fade;

            if (!self.first) {
                // Draw this particle
                context.beginPath();
                context.fillStyle = self.color();
                context.arc(self.x, self.y, self.size, 2 * Math.PI, false);
                context.fill();
                context.stroke();
            }

            // Draw Subparticles
            for (var i = 0; i < self.particles.length; i++) {
                // Draw subparticle
                self.particles[i].draw(context);
                // Remove if off-screen
                if (self.particles[i].done()) {
                    self.particles.splice(i, 1);
                    i--;
                }
            }

        };

        self.done = function() {
            return (self.x > window.innerWidth || self.y > window.innerHeight || self.x < 0 || self.y < 0)
                && (self.particles.length == 0);
        };
    };

    $(document).resize(Canvas.resize);
    Canvas.resize();
    setInterval(Sky.draw, 50);
});


