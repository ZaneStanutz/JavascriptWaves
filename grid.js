const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const util = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({width, height}) => {
  const cols = 12;
  const rows = 12;
  const numOfCells = cols * rows;

  // grid
  const gw = width * 0.8;
  const gh = height * 0.8;
  // cell
  const cellWidth = gw / cols;
  const cellHeight = gh / rows;
  // margin
  const marginX = (width - gw) * 0.5;
  const marginY = (width - gh) * 0.5;

  const points = [];

  let x,y,n;
  let frequency = 0.001;
  let amplitude = 90;
  
  for(let i = 0 ; i < numOfCells; i++){
    // this code should be replaced...
    x = ((i % cols) * cellWidth);
    y = (Math.floor( i/cols ) * cellHeight);

    n = random.noise2D(x,y, frequency, amplitude);
    x += n;
    y += n;
    points.push(new Point({x,y}));
  }
  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    
    context.translate(marginX,marginY);
    context.translate(cellWidth * 0.5, cellHeight * 0.5);
    context.strokeStyle = 'white';
    context.lineWidth = 4;

    // draw lines
    for(let r = 0; r < rows; r++){
      context.beginPath();
      for(let c = 0; c < cols - 1; c++){
        
        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];
        console.log(curr);
        const mx = curr.x + (next.x - curr.x) * 0.5;
        const my = curr.y + (next.y - curr.y) * 0.5;

        if(c == 0) context.moveTo(curr.x, curr.y);
        else if(c == cols - 2) context.quadraticCurveTo(curr.x, curr.y , next.x, next.y);
        else context.quadraticCurveTo(curr.x,curr.y, mx , my);
      }
      context.stroke();
    } 

    
    //draw points
    points.forEach(point => {
      point.draw(context);
    })

    context.restore();
  };
};

//point class
class Point {
  constructor({ x, y}) {
    this.x = x;
    this.y = y;
  }
  draw(context){
    context.save()
    context.translate(this.x, this.y);
    context.fillStyle = 'blue';

    context.beginPath();
    context.arc(0, 0, 15, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

canvasSketch(sketch, settings);
