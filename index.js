//score
let score= 0;


// Ball

class Ball {
	constructor(x, y, radius, speedX, speedY) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speedX = speedX;
		this.speedY = speedY;
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		context.fillStyle = "purple";
		context.fill();
		context.closePath();
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
}

//Paddle

class Paddle {
	constructor(x, y, width, height, speed){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
	}
	draw(context) {
		context.fillStyle = 'orange';
		context.fillRect(this.x, this.y, this.width, this.height);

	}
	move(direction) {
		this.x += this.speed * direction;
	}

}

//Brick

class Brick {
	constructor (x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.status = 1;
	}
	draw(context){
		if(this.status === 1){
			context.fillStyle = 'yellow';
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}
}




const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const ball = new Ball(200, 200, 7, -2, -2);
const paddle = new Paddle(175, canvas.height-10,100,10, 15);

//brick wall

const bricks = [];

function createBrickWall(){
	const brickRowCount = 4;
	const brickColumnCount = 8;
	const brickWidth = 50;
	const brickHeight = 20;
	const brickPadding = 10;

	for (let c = 0; c < brickColumnCount; c++){
		for(let r = 0; r < brickRowCount; r++){
			const x = c * (brickWidth + brickPadding);
			const y = r * (brickHeight + brickPadding);
			bricks.push(new Brick(x, y, brickWidth, brickHeight));
		}
	}
}




// Update and draw bricks

function drawBricks(){
	bricks.forEach(brick =>{
		if(brick.status === 1){
			brick.draw(context);
			//check for collision with ball
			if (ball.x> brick.x && ball.x < brick.x + brick.width &&
				ball.y > brick.y && ball.y < brick.y + brick.height){
					ball.speedY = -ball.speedY;
					brick.status = 0;
					score +=10;
					document.getElementById("score").innerHTML = `Score: ${score}`;
				}
		}
	})
}

//paddle control

document.addEventListener("keydown", (event)=>{
	if(event.key === "ArrowLeft") {
		paddle.move(-1);
	} else if(event.key === "ArrowRight"){
		paddle.move(1);
	}
	//cheat
	else if(event.key === "ArrowDown"){
		paddle.width = canvas.width;
	}
})

document.addEventListener("keyup", (event)=>{
	if(event.key === "ArrowLeft" || event.key === "ArrowRight"){
		paddle.move(0);
	} //cheat
	else if(event.key === "ArrowDown"){
		paddle.width = 100;
	}
})

createBrickWall();

function resetGame(){
	ball.x = 200;
	ball.y = 200;
	ball.speedX = -2;
	ball.speedY = -2;
	paddle.x = 175;
	score = 0;
	bricks.forEach(brick => {
		brick.status =1;
	})
}


function gameLoop(){
	//clear canvas
	context.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
	
	//draw ball updated position
	ball.update()
	ball.draw(context);
	
	//ball collision detection
	 //sides
	if(ball.x - ball.radius <0 || ball.x + ball.radius > canvas.width){
		ball.speedX = -ball.speedX;
	}

	//top side

	if(ball.y - ball.radius < 0) {
		ball.speedY = -ball.speedY;
	}
	
	//paddle collision detection

	if( ball.x + ball.radius > paddle.x &&
		ball.x - ball.radius < paddle.x + paddle.width &&
		ball.y + ball.radius > paddle.y){
			ball.speedY = -ball.speedY;
		}
	
	//
	if(ball.y + ball.radius > canvas.height){
		alert("Game Over! You Lose!")
		resetGame();
	}

	if(bricks.every(brick => brick.status === 0)){
		alert("Congratulations! You are legend! \n Score: " + score);
		resetGame();
	}
	//paddle
	paddle.draw(context);
	
	//bricks
	drawBricks()

	//loop
	requestAnimationFrame(gameLoop);

}

gameLoop();


