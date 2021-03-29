//test code

// i can initialize variables with numbers, strings, booleans etc.
// let myNum = 6;
// const myName = "Chris";
// alert(myName);
// alert(myNum);
// myNum = 25;
// alert(myNum);

// add a canvas to the page


// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 150, 100);

// let's write a program that creates rock paper scissors logic using circle, square, triangle

// gets mouse position and runs the shoot function
let player;
let mouseCoords = [];

addEventListener('mousedown', mouseClick);

function mouseClick(e) {
  console.log( `
    Screen X/Y: ${e.screenX}, ${e.screenY}
	Client X/Y: ${e.clientX}, ${e.clientY}`);
	mouseCoords =  [e.clientX, e.clientY];
  
	console.log(mouseCoords[0]);
  if (mouseCoords[0] < getRandomInt(300)){
    alert("I can click and get feedback from computer based on mouse position");
  }
}


//initializing variables to create a canvas 
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

let randNum = Math.random();

console.log(randNum);

if (true) {
  alert("hello world...");
  if(randNum > mouseCoords){
    alert("Winner winner, chicken dinner!!!");
  }
}

// let drawTri = true;
// let drawCir = false;

// let player = prompt("rock paper or scissors");
// let cpu = "paper";

// this function tests whether the player won the round
// this requires an entry from the player
function RPS(){
  if (player == "scissors" && cpu == "paper") {
    drawTriangle();
  }
  else if(player == "rock" && cpu == "scissors"){
    drawCircle();
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//init a function to draw a triangle on the canvas
function drawTriangle() {
      ctx.beginPath();
      ctx.moveTo(75, 50);
      ctx.lineTo(100, 75);
      ctx.lineTo(100, 25);
      ctx.fill();
    }

  function drawSquare(){
    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }
  function drawCircle(){
    //ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  }
  d = new Date();

  function main(){
  //  RPS();
  
  }

main();