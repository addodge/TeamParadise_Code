//Basic Rough Draft of Alan In Paradise Game


var bird;
var pipes = [];
var score = 0;
var img;
var pix;

function setup() {
  pix = loadImage('AlanParadiseGif.gif');
  //pix.loadPixels();
  //img = createImage(850, 500, pix.pixels);
  createCanvas(850, 500);
  background(pix);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  //background(0);

  image(gif,0,0);

  for (var i = pipes.length-1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
   
    if (pipes[i].hits(bird)) {   //When our bird hits any pipe.
      console.log("HIT");

    }

    if (pipes[i].offscreen()) {  //deletes pipes after they go offscreen
      pipes.splice(i, 1);
      score += 1;
      console.log("This is the score: ", score)
    }
  }

  bird.update();
  bird.show();

  if (frameCount % 80 == 0) {   //Distance between pipes
    pipes.push(new Pipe());
  }


}

function keyPressed() {
  if (key == ' '){
    bird.up();
  }
}

function Bird() {        //bird object
  this.y = height/4;
  this.x = 60;

  this.gravity = .6;
  this.lift = -12;
  this.velocity = 0;

  this.show = function() {
    fill(0,191,255);  //bird attributes *can add images/gifs later!*
    ellipse(this.x, this.y, 35, 35);

    var bird = loadImage ('empty-example/AlanParadiseGif.gif');
    image(bird, 300,300,309,156);

  }





  this.up = function() {
    this.velocity += this.lift;
  }

  this.update = function() {
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }  

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    } 

  }

}


function Pipe() {
  this.spacing = 150;
  this.top = random(height/6,  3/4 * height);
  this.bottom = height - (this.top + this.spacing);
  this.x = width;
  this.w = 80;
  this.speed = 6;
    
  this.highlight = false;

  this.hits = function(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        //this.score = this.score + 1;
        return true;
      }
    }
    //else{
    //  console.log("birdie not hit");
    //}
    this.highlight = false;
    return false;
  }

  this.show = function() {
    fill(124,252,0);
    if (this.highlight) {
      fill(255, 0, 0);
      //where bird hits the pipes
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height-this.bottom, this.w, this.bottom);
  }

  this.update = function() {
    this.x -= this.speed;
  }

  this.offscreen = function() {
    if (this.x < -this.w) {
      return true;
    } 
    else {
      	return false;
    }
  }

}

/*
function Score() {  //need to expand scoring function
  this.score = 0;
    console.log("This is: ", this.score);
}
*/
