function createGame(balloonURI, balloonImage) {
  var game = new Phaser.Game(document.documentElement.clientWidth, document.documentElement.clientHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
  var balloon;

  function update() {}

  function render() {}

  function preload() {
    game.cache.addImage('balloon', balloonURI, balloonImage);
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // This creates a simple sprite that is using our loaded image and displays it on-screen and assign it to a variable
    balloon = game.add.sprite(400, 200, 'balloon');
    game.physics.enable(balloon, Phaser.Physics.ARCADE);

    // This gets it moving
    balloon.body.velocity.setTo(200, 200);

    // This makes the game world bounce-able
    balloon.body.collideWorldBounds = true;

    // This sets the image bounce energy for the horizontal  and vertical vectors (as an x,y point). "1" is 100% energy return
    balloon.body.bounce.set(1.0);
    balloon.body.gravity.set(0, 380);

    balloon.inputEnabled = true;
    balloon.events.onInputDown.add(function(sprite, pointer) {
      var xVel = -10 * ((pointer.position.x - sprite.position.x) - (sprite.body.width / 2));
      sprite.body.velocity.x = xVel;
      sprite.body.velocity.y = -280;
    }, this);
  }

  return game;
}

var Canvas = (function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  return { context: context, width: width, height: height, on: on, setWidth: setWidth, setHeight: setHeight, offsetLeft: offsetLeft, offsetTop: offsetTop };

  function width() { return canvas.clientWidth }

  function height() { return canvas.clientHeight }

  function setWidth(w) { canvas.width = w }

  function setHeight(h) { canvas.height = h }

  function offsetLeft() { return canvas.offsetLeft }

  function offsetTop() { return canvas.offsetTop }

  function on(name, callback, capture) {
    canvas.addEventListener(name, callback, capture);
  }
})();

function colorClick(evt) {
  document.querySelector('.colorChooser.selected').classList.remove('selected');
  this.classList.add('selected');
  Canvas.context.strokeStyle = window.getComputedStyle(this).getPropertyValue('background-color');
}

Canvas.context.fillStyle = 'rgb(255,0,0)';
Canvas.context.strokeStyle = 'rgb(255,0,0)';
Canvas.context.lineWidth = 10;

function canvasResize() {
  Canvas.context.canvas.width = document.documentElement.clientWidth - 75;
  Canvas.context.canvas.height = document.documentElement.clientHeight;
  var choosers = document.querySelectorAll('.colorChooser');
  choosers.forEach(function(colorChooser) {
    colorChooser.height = document.documentElement.clientHeight / choosers.length;
    document.querySelector('.colorChooser.selected').click();
  });
}

window.addEventListener('resize', canvasResize);
canvasResize();

function startGame() {
  window.removeEventListener('resize', canvasResize);

  // Copy/descale to 100x100
  var can = document.createElement('canvas');
  can.width = 100;
  can.height = 100;
  var con = can.getContext('2d');
  con.drawImage(Canvas.context.canvas, 0, 0, 100, 100);

  // Store image
  var image = new Image();
  var imageURI = can.toDataURL('image/png');
  image.src = imageURI;
  var theGame = createGame(imageURI, image);
  document.body.removeChild(document.querySelector('#content'));
  window.addEventListener('resize', function() {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    theGame.width = width;
    theGame.height = height;
    if (theGame.stage.bounds) {
      theGame.stage.bounds.width = width;
      theGame.stage.bounds.height = height;
    }
  });
}

document.querySelectorAll('.colorChooser').forEach(function(color) {
  if (color.id === "ready") {
    color.addEventListener('click', startGame);
  } else {
    color.addEventListener('click', colorClick);
  }
});

document.querySelector('#color1').click();

Canvas.on('touchstart', mousedown, true);
Canvas.on('mousedown', mousedown, true);

Canvas.on('mousemove', mousemove);
Canvas.on('touchmove', mousemove);

Canvas.on('mouseup', mouseup);
Canvas.on('touchend', mouseup);
Canvas.on('touchcancel', mouseup);

var isMousedown = false;

function mousedown(evt) {
  Canvas.context.lineWidth = 10;
  Canvas.context.beginPath();

  var x = evt.pageX - Canvas.offsetLeft();
  var y = evt.pageY - Canvas.offsetTop();
  Canvas.context.moveTo(x - 5, y);
  Canvas.context.lineTo(x + 5, y);
  Canvas.context.stroke();
  Canvas.context.moveTo(x, y);
  isMousedown = true;
}

function mousemove(evt) {
  if (!isMousedown) return;
  if (!evt) evt = event;

  evt.preventDefault();

  if (evt.originalEvent) evt = evt.originalEvent;
  if (evt.targetTouches) evt = evt.targetTouches[0];

  var x = evt.pageX - Canvas.offsetLeft();
  var y = evt.pageY - Canvas.offsetTop();
  Canvas.context.lineTo(x, y);
  Canvas.context.stroke();
  Canvas.context.moveTo(x, y);
}

function mouseup(evt) {
  isMousedown = false;
  Canvas.context.closePath();
}