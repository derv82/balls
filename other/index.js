const Canvas = (function() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

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

const Color = {
  background: '#000',
  wall: '#333',
  road: '#ccc',
  path: '#383',
  cursor: '#3a3',
  goal: 'gold'
};

function Maze(width, height) {
  const cells = new Array(width);
  const path = [[0,1]];
  let positionX;
  let positionY;
  let won;

  reset();
  resize();

  return { reset: reset, resize: resize, draw: draw, move: move };

  function move(x, y) {
    if (won) return;
    const cellWidth = parseInt(Canvas.width() / width);
    const cellHeight = parseInt(Canvas.height() / height);
    const cellX = parseInt(x / cellWidth);
    const cellY = parseInt(y / cellHeight);
    if (path.find(([x,y]) => (cellX === x && cellY === y))) {
      while (true) {
        let pathPair = path.pop();
        if (pathPair[0] === cellX && pathPair[1] === cellY) {
          break;
        }
      }
    } else {
      const diffX = positionX > cellX ? positionX - cellX : cellX - positionX;
      const diffY = positionY > cellY ? positionY - cellY : cellY - positionY;
      if (diffX >= 1 && diffY >= 1) {
        throw new Error('Invalid move (' + cellX + ',' + cellY + ') too far from current position (' + positionX + ',' + positionY + ')');
      } else if (diffX > 1 || diffY > 1) {
        throw new Error('Invalid move (' + cellX + ',' + cellY + ') too far from current position (' + positionX + ',' + positionY + ')');
      } else if (cells[cellX][cellY] !== 1) {
        throw new Error('Invalid move (' + cellX + ',' + cellY + ') not a road');
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
    setTimeout(() => {
      reset();
    }, 2000);

    // Rainbow, from https://stackoverflow.com/a/37713923
    const canvasWidth = Canvas.width();
    const canvasHeight = Canvas.height();
    let bars = 20, i = 0, radius = Math.min(canvasWidth, canvasHeight);
    Canvas.context.lineWidth = radius / 50;
    for (i = 0; i < bars; i++, radius -= Canvas.context.lineWidth - 1) { // increase bar, reduce radius
      console.log('drawing line', i);
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

  function reset() {
    let x, y;

    won = false;
    positionX = 0;
    positionY = 1;
    while (path.length > 1) path.pop();

    for (x = 0; x < cells.length; x++) {
      cells[x] = new Array(height);
      for (y = 0; y < cells[x].length; y++) {
        cells[x][y] = 0;
      }
    }
    _buildMaze();
    draw();
  }

  function draw() {
    const cellWidth = parseInt(Canvas.width() / width);
    const cellHeight = parseInt(Canvas.height() / height);

    let x, y, cellX, cellY;

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
    const cellWidth = parseInt(Canvas.width() / width);
    const cellHeight = parseInt(Canvas.height() / height);
    let x, y;
    path.forEach(([cellX, cellY], index) => {
      if (index === path.length - 1) {
        Canvas.context.fillStyle = Color.cursor;
      } else {
        Canvas.context.fillStyle = Color.path;
      }
      x = cellX * cellWidth;
      y = cellY * cellHeight;
      Canvas.context.fillRect(x, y, cellWidth, cellHeight);
    });
  }

  function _buildMaze() {
    const moves = [];
    let x = 0, y = 1, directions, direction, movePair;
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

const maze = Maze(8, 6);

window.addEventListener('resize', maze.resize);

let dragging = false;

Canvas.on('mousedown', event => {
  maze.move(event.clientX, event.clientY);
  dragging = true;
}, true);

Canvas.on('mousemove', event => {
  if (dragging) {
    maze.move(event.clientX, event.clientY);
  }
}, true);

Canvas.on('mouseup', event => dragging = false);

Canvas.on('selectstart', event => {e.preventDefault(); return false; }, false);