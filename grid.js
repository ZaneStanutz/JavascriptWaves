const canvasSketch = require('canvas-sketch');
import { random, math } from 'canvas-sketch-util';
const  colorMap = require("colormap");



const settings = {
  dimensions: [ 1080, 1080 ], 
  animate: true,
  fps: 30
};

const sketch = ({width, height}) => {
  const cols = 72;
  const rows = 25;
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

  let x,y,n,curveWidth, color, pointColor;
  let frequency = 0.001;
  let amplitude = 90;

  const lineColors = colorMap({
    colormap: 'winter',
    nshades: amplitude
  });

  const pointColors = colorMap({
    colormap: 'viridis',
    nshades: 100
  });

  
  for(let i = 0 ; i < numOfCells; i++){
    // this code should be replaced...
    x = ((i % cols) * cellWidth);
    y = (Math.floor( i/cols ) * cellHeight);

    n = random.noise2D(x,y, frequency, amplitude);
    // x += n;
    // y += n;

    curveWidth = math.mapRange(n,-amplitude, amplitude, 5 ,10);
    color = lineColors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0 , amplitude))]; 
    pointColor = pointColors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))]
    points.push(new Point({ x , y , curveWidth, color , pointColor}));
  }
  
  return ({ context, width, height,frame}) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    
    context.translate(marginX,marginY);
    context.translate(cellWidth * 0.5, cellHeight * 0.5);
    context.strokeStyle = 'white';

    points.forEach(point => {
      n = random.noise2D(point.ix + frame * 2 ,point.iy + frame *2, frequency, amplitude);
      //console.log(n);
      point.x = point.ix + n;
      point.y = point.iy + n;
    });

    let lastX, lastY;

    // draw lines
    for(let r = 0; r < rows; r++){
  
      for(let c = 0; c < cols - 1 ; c++){
        
        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];
        const mx = curr.x + (next.x - curr.x) * 0.3;
        const my = curr.y + (next.y - curr.y) * 3;

        if(!c){
          lastX = curr.x;
          lastY = curr.y;
        }
        context.beginPath();

        context.lineWidth = curr.curveWidth;
        context.strokeStyle = curr.color;

        context.moveTo(lastX, lastY);

        // if(c == 0) context.moveTo(curr.x, curr.y);
        // else if(c == cols - 2) context.quadraticCurveTo(curr.x, curr.y , next.x, next.y);
        if(c == color.length - 2)
          context.quadraticCurveTo(curr.x,curr.y, next.x , next.y);
        else{
          context.quadraticCurveTo(curr.x,curr.y, next.x, next.y);
        }
        context.stroke();

        lastX = mx - c / cols * 250;
        lastY = my -r / rows * 250;
      }
      
    } 

    //draw points
    points.forEach(point => {
      //point.draw(context);
    })

    context.restore();
  };
};

//point class
class Point {
  constructor({ x, y, curveWidth, color, pointColor}) {
    this.x = x;
    this.y = y;
    this.curveWidth = curveWidth;
    this.color = color;
    this.pointColor = pointColor;

    this.ix = x;
    this.iy = y;

  }
  draw(context){
    context.save()
    context.translate(this.x, this.y);
    context.fillStyle = this.pointColor;
    context.beginPath();
    context.arc(0, 0, 9, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

canvasSketch(sketch, settings);
