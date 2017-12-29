var Canvas = (function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  return { context: context, width: width, height: height, resize: resize, on: on };

  function width() {
    return canvas.clientWidth;
  }

  function height() {
    return canvas.clientHeight;
  }

  function resize() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }

  function on(name, callback, capture) {
    canvas.addEventListener(name, callback, capture);
  }
})();

var Color = {
  background: '#000',
  wall: '#333',
  road: '#ccc',
  path: '#383',
  cursor: '#3a3',
  goal: 'gold'
};

function Maze(width, height) {
  var cells = new Array(width);
  var path = [[0,1]];
  var positionX;
  var positionY;
  var won;

  reset();
  resize();

  return { reset: reset, resize: resize, draw: draw, move: move };

  function move(x, y) {
    if (won) return;
    var cellWidth = parseInt(Canvas.width() / width);
    var cellHeight = parseInt(Canvas.height() / height);
    var cellX = parseInt(x / cellWidth);
    var cellY = parseInt(y / cellHeight);
    if (path.find(function(arr) { return (cellX === arr[0] && cellY === arr[1]); })) {
      while (true) {
        var pathPair = path.pop();
        if (pathPair[0] === cellX && pathPair[1] === cellY) {
          break;
        }
      }
    } else {
      var diffX = positionX > cellX ? positionX - cellX : cellX - positionX;
      var diffY = positionY > cellY ? positionY - cellY : cellY - positionY;
      if (diffX >= 1 && diffY >= 1) {
        return;
        //throw new Error('Invalid move (' + cellX + ',' + cellY + ') too far from current position (' + positionX + ',' + positionY + ')');
      } else if (diffX > 1 || diffY > 1) {
        return;
        //throw new Error('Invalid move (' + cellX + ',' + cellY + ') too far from current position (' + positionX + ',' + positionY + ')');
      } else if (cells[cellX][cellY] !== 1) {
        return;
        //throw new Error('Invalid move (' + cellX + ',' + cellY + ') not a road');
      }
    }
    positionX = cellX;
    positionY = cellY;
    path.push([cellX, cellY]);
    draw();

    if (positionX === width - 2 && positionY === height - 1) {
      win();
    }
  }

  function win() {
    if (won) return;
    won = true;
    setTimeout(function() {
      reset(width + 2, height + 2);
    }, 2000);

    // Rainbow, from https://stackoverflow.com/a/37713923
    var canvasWidth = Canvas.width();
    var canvasHeight = Canvas.height();
    var bars = 20, i = 0, radius = Math.min(canvasWidth, canvasHeight);
    Canvas.context.lineWidth = radius / 50;
    for (i = 0; i < bars; i++, radius -= Canvas.context.lineWidth - 1) { // increase bar, reduce radius
      Canvas.context.beginPath();
      Canvas.context.arc(canvasWidth * 0.5, canvasHeight, radius, 0, Math.PI, true); // half circle
      Canvas.context.strokeStyle = "hsl(" + (i / bars * 300) + ",90%,50%,50%)";  // set color using HSL
      Canvas.context.stroke();
    }
  }

  function resize() {
    Canvas.resize();
    draw();
  }

  function reset(newWidth, newHeight) {
    var x, y;
    if (newWidth !== undefined && newHeight !== undefined) {
      width = newWidth;
      height = newHeight;
    }

    won = false;
    positionX = 0;
    positionY = 1;
    while (path.length > 1) path.pop();
    while (cells.length > 0) cells.pop();

    for (x = 0; x < width; x++) {
      cells.push(new Array(height));
      for (y = 0; y < height; y++) {
        cells[x][y] = 0;
      }
    }
    _buildMaze();
    draw();
  }

  function draw() {
    var cellWidth = parseInt(Canvas.width() / width);
    var cellHeight = parseInt(Canvas.height() / height);

    var x, y, cellX, cellY;

    Canvas.context.fillStyle = Color.background;
    Canvas.context.fillRect(0, 0, Canvas.width(), Canvas.height());

    for (cellX = 0; cellX < cells.length; cellX++) {
      x = cellX * cellWidth;
      for (cellY = 0; cellY < cells[cellX].length; cellY++) {
        y = cellY * cellHeight;
        if (cellX === width - 2 && cellY === height - 1) {
          Canvas.context.fillStyle = Color.goal;
        } else if (cells[cellX][cellY] === 0) {
          Canvas.context.fillStyle = Color.wall;
        } else {
          Canvas.context.fillStyle = Color.road;
        }
        Canvas.context.fillRect(x, y, cellWidth, cellHeight);
      }
    }
    _drawPath();
  }

  function _drawPath() {
    var cellWidth = parseInt(Canvas.width() / width);
    var cellHeight = parseInt(Canvas.height() / height);
    var x, y;
    path.forEach(function(arr, index) {
      if (index === path.length - 1) {
        Canvas.context.fillStyle = Color.cursor;
      } else {
        Canvas.context.fillStyle = Color.path;
      }
      x = arr[0] * cellWidth;
      y = arr[1] * cellHeight;
      Canvas.context.fillRect(x, y, cellWidth, cellHeight);
    });
  }

  function _buildMaze() {
    var moves = [];
    var x = 0, y = 1, directions, direction, movePair;
    cells[x][y] = 1;
    while (x !== width || y !== height) {
      directions = [];
      if (x > 2 && cells[x-1][y] === 0 && cells[x-2][y] === 0) directions.push('W');
      if (y > 2 && cells[x][y-1] === 0 && cells[x][y-2] === 0) directions.push('N');
      if (x < width - 2  && cells[x+1][y] === 0 && cells[x+2][y] === 0) directions.push('E');
      if (y < height - 2 && cells[x][y+1] === 0 && cells[x][y+2] === 0) directions.push('S');

      if (directions.length === 0) {
        if (moves.length === 0) break;
        movePair = moves.pop();
        x = movePair[0];
        y = movePair[1];
        continue;
      } else {
        moves.push([x, y]);
      }

      direction = directions[Math.floor(Math.random() * directions.length)];

      switch (direction) {
          case 'W': x -= 1; break;
          case 'N': y -= 1; break;
          case 'E': x += 1; break;
          case 'S': y += 1; break;
      }
      cells[x][y] = 1;

      switch (direction) {
          case 'W': x -= 1; break;
          case 'N': y -= 1; break;
          case 'E': x += 1; break;
          case 'S': y += 1; break;
      }
      cells[x][y] = 1;
    }
    console.log('_buildMaze done');
  }
}

var maze = Maze(8, 6);

window.addEventListener('resize', maze.resize);

var dragging = false;

function mousedown(event) {
  dragging = true;
  maze.move(event.pageX, event.pageY);
}

function mouseup(event) {
  dragging = false;
}

function mousemove(theEvent) {
  var evt = theEvent || event;
  if (dragging) {
    evt.preventDefault();
    if (evt.targetTouches && evt.targetTouches.length > 0) {
      evt = evt.targetTouches[0];
    }
    maze.move(evt.pageX, evt.pageY);
  }
}

Canvas.on('mousedown', mousedown, true);
Canvas.on('touchstart', mousedown, true);

Canvas.on('mousemove', mousemove);
Canvas.on('touchmove', mousemove);

Canvas.on('mouseup', mouseup);
Canvas.on('touchend', mouseup);
Canvas.on('touchcancel', mouseup);
