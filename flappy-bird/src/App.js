
import React, {Component} from 'react';
import './App.css';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 60;
const MIN_PIPE_HEIGHT = 40;
const FPS = 120;

class Bird {
  constructor(ctx){
    this.ctx = ctx;
    this.x = 50;
    this.y = 150;
    this.gravity = 0;
    this.velocity = 0.1;
  }

  draw() {
    this.ctx.fillStyle = "#ccc";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  update = () => {
    this.gravity += this.velocity;
    this.gravity = Math.min(4, this.gravity);
    this.y += this.gravity;
  }

  jump = () => {
    this.gravity = -3;
  }
}


class Pipe{
  constructor(ctx, height, space){
    this.ctx = ctx;
    this.isDead = false;
    this.x = WIDTH;
    this.y = height ? HEIGHT - height : 0;
    this.width = PIPE_WIDTH;
    this.height = height || MIN_PIPE_HEIGHT + Math.random() * (HEIGHT - space - MIN_PIPE_HEIGHT * 2);
  }

  draw(){
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    
  }

  update = () => {
    this.x -= 1;
    if ((this.x + PIPE_WIDTH) < 0) {
      this.isDead = true;
    }
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
    this.space = 120;
    this.frameCount = 0;
    this.pipes = [];
    this.birds = [];
  }

  componentDidMount(){
    document.addEventListener('keydown', this.onKeyDown);
    const ctx = this.getCtx();
    this.pipes = this.generatePipes();
    this.birds = [new Bird(ctx)];
    this.loop = setInterval(this.gameLoop, 1000 / FPS);

  }

  onKeyDown = (e) => {
    if (e.code === 'Space'){
      this.birds[0].jump();
    }
  }

  getCtx = () => this.canvasRef.current.getContext('2d');
     
  
  generatePipes = () => {
    const ctx = this.getCtx();
    const firstPipe = new Pipe(ctx, null, this.space);
    const secondPipeHeight = HEIGHT - firstPipe.height - this.space;
    const secondPipe = new Pipe(ctx, secondPipeHeight, 80);
    return [firstPipe, secondPipe];
  }

  gameLoop = () => {
    this.update();
    this.draw();
  }


  update = () => {
    this.frameCount = this.frameCount + 1;
    if (this.frameCount % 200 === 0) {
      const pipes = this.generatePipes();
      this.pipes.push(...pipes);
    }

    // update pipe positions
    this.pipes.forEach(pipe => pipe.update());
    this.pipes = this.pipes.filter(pipe => !pipe.isDead);

    // update bird positions
    this.birds.forEach(bird => bird.update());

    if(this.isGameOver()){
      alert('Game Over!');
      clearInterval(this.loop);
    }

  }

  isGameOver = () => {
      //detect collisions
      let gameOver = false;
      this.birds.forEach(bird => {
        this.pipes.forEach(pipe => {
          if (bird.y < 0 || bird.y > HEIGHT || (
            bird.x > pipe.x && bird.x < pipe.x + pipe.width && bird.y > pipe.y && bird.y < pipe.y + pipe.height)) {
              gameOver = true;
          }
        });
      });

      return gameOver;
    } 
   

  draw = () => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.pipes.forEach(pipe => pipe.draw());
    this.birds.forEach(bird => bird.draw());
  }


  render(){
  return (
    <div className="App">
      <div class = 'head' ><h1>FLAPPY BIRD</h1> </div> 
      <canvas ref={this.canvasRef} width={WIDTH} height={HEIGHT}
      style={{marginTop: '100px', border: '1px solid #c3c3c3'}}>
      Your browser does not support the canvas element.
      </canvas>
    </div>
  );
}
}

export default App;
