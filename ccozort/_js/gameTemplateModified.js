//sources
// https://eloquentjavascript.net/code/chapter/17_canvas.js
// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event

//##################### ALL GLOBALS AND UTILITY FUNCTIONS ###################

//initializing GLOBAL variables to create a canvas
let canvasDiv;
let canvas;
let ctx;
let WIDTH = 768;
let HEIGHT= 768;
let SCORE = 0;
let GRAVITY = 9.8;
let paused = false;
let timerThen = Math.floor(Date.now() / 1000);

//
let effects = [];

//walls
let walls = [];

//array for mobs/enemies
let mobs1 = [];
let mobs2 = [];
let mobs3 = [];

// lets us know if game is initialized
let initialized = false;

// setup mouse position variables
let mouseX = 0;
let mouseY = 0;

// object setting mousePos
let mousePos = {
  x: 0,
  y: 0
};

let mouseClick = {
  x: null,
  y: null
};

// setting up background image element

// set variable to determine image readiness/loaded
let imgready = false;
// assigns image element to variable
let backgroundimg = new Image();
// sets bg image source
backgroundimg.src = '_images/oprimebot.jpg';
// tells browser images has been loaded successfully
backgroundimg.onload = function () {
  backgroundimg.rdy = true;
}

function pointCollide(point, obj) {
  if (point.x <= obj.x + obj.w &&
    obj.x <= point.x &&
    point.y <= obj.y + obj.h &&
    obj.y <= point.y
  ) {
    console.log('point collided');
    return true;
  }
}

function signum(){
 let options = [-1,1];
 index = Math.floor(Math.random()*options.length);
 result = options[index];
 return result;
}

//mob spawner
function spawnMob(x, arr, color){
for (i = 0; i < x; i++){
  arr.push(new Mob(60,60, 200, 100, color, Math.random()*3*signum(), Math.random()*3*signum()));
}
}
// draws text on canvas
function drawText(color, font, align, base, text, x, y) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillText(text, x, y);
}

//Timers and counters

function countUp(end) {
  timerNow = Math.floor(Date.now() / 1000);
  currentTimer = timerNow - timerThen;
  if (currentTimer >= end){
    return end;
  }
  return currentTimer;
}

function counter() {
  timerNow = Math.floor(Date.now() / 1000);
  currentTimer = timerNow - timerThen;
  return currentTimer;
}

function timerUp(x, y) {
  timerNow = Math.floor(Date.now() / 1000);
  currentTimer = timerNow - timerThen;
  if (currentTimer <= y && typeof (currentTimer + x) != "undefined") {
      return currentTimer;
  } else {
      timerThen = timerNow;
      return x;
  }
}

function timerDown() {
  this.time = function (x, y) {
      // this.timerThen = Math.floor(Date.now() / 1000);
      // this.timerNow = Math.floor(Date.now() / 1000);
      this.timerThen = timerThen;
      this.timerNow = Math.floor(Date.now() / 1000);
      this.tick = this.timerNow - this.timerThen;
      if (this.tick <= y && typeof (this.tick + x) != "undefined") {
          return y - this.tick;
      } else {
          this.timerThen = this.timerNow;
          return x;
      }
  };
}



//########################### Initialize game function #######################

function init() {
  // create a new div element
  canvasDiv = document.createElement("div");
  canvasDiv.id = "chuck";
  // and give it some content
  canvas = document.createElement('canvas');
  // add the text node to the newly created div
  canvasDiv.appendChild(canvas);
  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(canvasDiv, currentDiv);
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.getElementById("chuck").style.width = canvas.width + 'px';
  document.getElementById("chuck").style.height = canvas.height + 'px';
  ctx = canvas.getContext('2d');
  initialized = true;
}


//############################ ALL GAME CLASSES #########################
class Sprite {
  constructor(w, h, x, y, c) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.color = c;
    this.spliced = false;
    }
    get cx() { return this.x + this.w * 0.5; }
    get cy() { return this.y + this.h * 0.5; }
    inbounds(){
      if (this.x + this.w < WIDTH &&
          this.x > 0 &&
          this.y > 0 &&
          this.y + this.h < HEIGHT){
            // console.log ('inbounds..');
        return true;
      }
      else{
        return false;
      }
    }
    
    //source for collision: https://pothonprogramming.github.io/
    collideRectangle(rect) {

      var dx = rect.cx - this.cx;// x difference between centers
      var dy = rect.cy - this.cy;// y difference between centers
      var aw = (rect.w + this.w) * 0.5;// average width
      var ah = (rect.h + this.h) * 0.5;// average height

      /* If either distance is greater than the average dimension there is no collision. */
      if (Math.abs(dx) > aw || Math.abs(dy) > ah) return false;

      /* To determine which region of this rectangle the rect's center
      point is in, we have to account for the scale of the this rectangle.
      To do that, we divide dx and dy by it's width and height respectively. */
      if (Math.abs(dx / this.w) > Math.abs(dy / this.h)) {
      
        if (dx < 0) {rect.x = this.x - rect.w;
          ctx.fillStyle = 'green';
          ctx.fillRect(0, 0, WIDTH/0, HEIGHT/0);
          ctx.strokeRect(0, 0, WIDTH/0, HEIGHT/0);
        }// left
        else rect.x = this.x + this.w; // right
        
      } else {

        if (dy < 0) rect.y = this.y - rect.h; // top
        else rect.y = this.y + this.h; // bottom

      }

      return true;

    }
    collide(obj) {
      if (this.x <= obj.x + obj.w &&
        obj.x <= this.x + this.w &&
        this.y <= obj.y + obj.h &&
        obj.y <= this.y + this.h
      ) {
        return true;
      }
    }
}

class Player extends Sprite {
  constructor(w, h, x, y, c, vx, vy) {
  super(w, h, x, y, c);
  this.vx = vx;
  this.vy = vy;
  this.speed = 3;
  this.canjump = true;
  }
  moveinput() {
    if ('w' in keysDown || 'W' in keysDown) { // Player control
        this.dx = 0;
        this.dy = -1;  
        // this.vx = 0;
        this.vy = -this.speed;
    } else if ('s' in keysDown || 'S' in keysDown) { // Player control
        this.dx = 0;
        this.dy = 1;  
        // this.vx = 0;
        this.vy = this.speed;

    } else if ('a' in keysDown || 'A' in keysDown) { // Player control
        this.dx = -1;
        this.dy = 0;
        // this.vy = 0;
        this.vx = -this.speed;

    } else if ('d' in keysDown || 'D' in keysDown) { // Player control
        this.dx = 1;
        this.dy = 0;
        // this.vy = 0;
        this.vx = this.speed;
    } else if ('e' in keysDown || 'E' in keysDown) { // Player control
      this.w += 1;
  }
  else if ('p' in keysDown || 'P' in keysDown) { // Player control
    paused = true;
}
    else if (' ' in keysDown && this.canjump) { // Player control
      console.log(this.canjump);
      this.vy -= 45;
      this.canjump = false;
      
  }
    else{
      // this.dx = 0;
      // this.dy = 0;
      this.vx = 0;
      this.vy = GRAVITY;
    }
}
  update(){
    this.moveinput();
    if (!this.inbounds()){
      if (this.x <= 0) {
        this.x = 0;
      }
      if (this.x + this.w >= WIDTH) {
        this.x = WIDTH-this.w;
      }
      if (this.y+this.h >= HEIGHT) {
        this.y = HEIGHT-this.h;
        this.canjump = true;
      }
      // alert('out of bounds');
      // console.log('out of bounds');
    }
    
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}

class Mob extends Sprite {
  constructor(w, h, x, y, c, vx, vy) {
    super(w, h, x, y, c);
    this.vx = vx;
    this.vy = vy;
    this.type = "normal";
    }
    update(){
      this.x += this.vx;
      this.y += this.vy;
      if (!this.inbounds()){
        if (this.x < 0 || this.x > WIDTH) {
          this.vx *= -1;
        }
        if (this.y < 0 || this.y > HEIGHT) {
          this.vy *= -1;
        }
        // alert('out of bounds');
        // console.log('out of bounds');
      }
      if (pointCollide(mouseClick, this)){
        console.log("direct hit!!!");
        // how do I tell it to be spliced???
        this.spliced = true;
        SCORE++;
        // this.vx *= -1;
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

class Wall extends Sprite {
  constructor(w, h, x, y, c) {
    super(w, h, x, y, c);
    this.type = "normal";
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

// ### added by Mr. Cozort

//this class is intended to create an effect when the mouse clicked
class Effect extends Sprite {
  constructor(w, h, x, y, c) {
    super(w, h, x, y, c);
    this.type = "normal";
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    update(){
      this.w+=5;
      this.h+=5;
      this.x-=1;
      this.y-=1;
      setTimeout(() => this.spliced = true, 250)
    }
}

// ###################### INSTANTIATE CLASSES ##########################
let player = new Player(25, 25, WIDTH/2, HEIGHT/2, 'red', 0, 0);

// adds two different sets of mobs to the mobs array
spawnMob(20, mobs1, 'red');
spawnMob(20, mobs2, 'blue');


while (walls.length < 20){
  walls.push(new Wall(200,15, Math.floor(Math.random()*500), Math.floor(Math.random()*1000), 'orange'));
}

// ########################## USER INPUT ###############################

let keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.key];
}, false);

// gets mouse position when clicked
addEventListener('mousemove', function (e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  
  // we're gonna use this
  mousePos = {
    x: mouseX,
    y: mouseY
  };
});

// gets mouse position when clicked
addEventListener('mousedown', function (e) {
  // console.log(`Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${e.clientY}`);
  mouseClick.x = e.offsetX;
  mouseClick.y = e.offsetY;
  effects.push(new Effect(15, 15, mouseClick.x - 7, mouseClick.y - 7, 'green'))
});

addEventListener('mouseup', function() {
  setTimeout(()=>{
    mouseClick.x = null;
    mouseClick.y = null;
  },
    1000
  )
  
});

let GAMETIME = null;
// ###################### UPDATE ALL ELEMENTS ON CANVAS ################################
function update() {
  player.update();
  for (e of effects) {
    e.update();
  }
  for (e in effects){
    if (effects[e].spliced){
      effects.splice(e, 1);
    }
  }
  GAMETIME = counter();
  if (GAMETIME > 5){
    console.log("game over...");
  }

  //updates all mobs in a group
  for (let w of walls){
   
    // if (player.collide(w) && player.dy == 1){
    //   player.dx = 0;
    //   player.vy*=-1;
    //   player.y = w.y-player.h;
    // }
    // if (player.collide(w) && player.dy == -1){
    //   player.vy*=-1;
    //   player.y = w.y + w.h;
    // }
    // if (player.collide(w) && player.dx == 1){
    //   player.vx*=-1;
    //   player.x = w.x-player.w;
    // }
    // if (player.collide(w) && player.dx == -1){
    //   player.vx*=-1;
    //   player.x = w.x + w.w;
    // }
  }
  for (let m of mobs1){
    m.update();
    if (player.collide(m)){
      SCORE++;
      m.spliced = true;
    }
  }
  for (let m of mobs2){
    m.update();
    if (player.collide(m)){
      m.spliced = true;
    }
  }
   for (let m2 of mobs2) {
     for (let m1 of mobs1){
       if (m2.collide(m1)){
        m1.vx *= 1;
        m1.vy *= 1;
        m2.vx *= 1;
        m2.vy *= 1;
        // m2.spliced = true;
       }
     }
   }
  // splice stuff as needed
  for (let m in mobs1){
    if (mobs1[m].spliced){
      mobs1.splice(m, 1);
    }
  }
  for (let m in mobs2){
    if (mobs2[m].spliced){
      mobs2.splice(m, 1);
    }
  }
  if (mobs1.length < 1){
    spawnMob(30, mobs1);
  }
}

// ########## DRAW ALL ELEMENTS ON CANVAS ##########
function draw() {
  // clears the canvas before drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //draws background image
  if (backgroundimg.rdy){
    ctx.drawImage(backgroundimg, 0, 0);
  }
  
  drawText('black', "24px Helvetica", "left", "top", "Timer: " + GAMETIME, 500, 0);
  drawText('black', "24px Helvetica", "left", "top", "Score: " + SCORE, 600, 0);
  // drawText('black', "24px Helvetica", "left", "top", "FPS: " + fps, 400, 0);
  // drawText('black', "24px Helvetica", "left", "top", "Delta: " + gDelta, 400, 32);
  // drawText('black', "24px Helvetica", "left", "top", "mousepos: " + mouseX + " " + mouseY, 0, 0);
  // drawText('black', "24px Helvetica", "left", "top", "mouseclick: " + mouseClick.x + " " + mouseClick.y, 0, 32);
  player.draw();

  for (let w of walls){
    w.draw();
  }
  for (let m of mobs1){
    m.draw();
  }
  for (let m of mobs2){
    m.draw();
  }
  for (let e of effects){
    e.draw();
  }
}

// set variables necessary for game loop
let fps;
let now;
let delta;
let gDelta;
let then = performance.now();

// ########## MAIN GAME LOOP ##########
function main() {
  now = performance.now();
  delta = now - then;
  gDelta = (Math.min(delta, 17));
  fps = Math.ceil(1000 / gDelta);
  if (initialized) {
    if (!paused){
      update(gDelta);
    }
    draw();
  }
  then = now;
  requestAnimationFrame(main);
}