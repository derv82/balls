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
  path: '#4af',
  cursor: '#7cf',
  goal: 'gold'
};

function Maze(width, height) {
  var cells = new Array(width);
  var path = [[1,1]];
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
      // If move is on existing path, roll path back.
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
        return; // Too far from current position
      } else if (diffX > 1 || diffY > 1) {
        return; // Too far from current position
        //throw new Error('Invalid move (' + cellX + ',' + cellY + ') too far from current position (' + positionX + ',' + positionY + ')');
      } else if (cells[cellX][cellY] !== 1) {
        return; // Not a road
      }
    }
    positionX = cellX;
    positionY = cellY;
    path.push([cellX, cellY]);
    draw();

    if (positionX === width - 2 && positionY === height - 2) {
      win();
    }
  }

  function win() {
    if (won) return;
    won = true;
    setTimeout(function() {
      reset(width + 2, height + 2);
    }, 2000);
    rainbow();
  }

  // From https://stackoverflow.com/a/37703101
  function rainbow() {
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    var arcWidth = 40, radius = 8 * arcWidth;
    var drawArc = function (color) {
      Canvas.context.beginPath();
      Canvas.context.arc(
        Canvas.width() / 2,
        Canvas.height() + arcWidth / 2,
        radius,
        Math.PI,
        2 * Math.PI
      );
      Canvas.context.lineWidth = arcWidth;
      Canvas.context.strokeStyle = color;
      Canvas.context.stroke();
      Canvas.context.closePath();
      radius += arcWidth;
    };
    colors.reverse().forEach( drawArc );
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
    positionX = 1;
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
        if (cellX === width - 2 && cellY === height - 2) {
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
    var x = 1, y = 1, directions, direction, movePair;
    cells[x][y] = 1;
    while (true) {
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

var maze = Maze(9, 7);

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
