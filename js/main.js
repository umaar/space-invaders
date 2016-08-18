document.addEventListener("DOMContentLoaded", start);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasDimensions = {
	width: canvas.width,
	height: canvas.height
};

let ship;
const allBullets = [];
const allInvaders = [];

function createInvaders() {
	const invadersPerRow = 6;
	const invaderWidth = (canvasDimensions.width / invadersPerRow) - 20;

	for (let i=0; i<invadersPerRow; i++) {
		new Invader( (i * invaderWidth) + 10 * i, 30, invaderWidth, 20 );
	}
}

class Invader {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		allInvaders.push(this);
	}

	draw() {
		if (Math.random() > 0.995) {
			new Bullet(this.x, this.y, 10);
		}

		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}


class Bullet {
	constructor(x, y, direction) {
		this.width = 2;
		this.height = 5;
		this.x = x;
		this.y = y;
		this.direction = direction;

		allBullets.push(this);
	}

	draw() {
		this.y += this.direction;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class Spaceship {
	constructor() {
		this.width = this.height = 30;
		this.x = canvasDimensions.width / 2;
		this.y = canvasDimensions.height - (this.height * 2);

		this.bindKeyboardEvents();
		this.pressedKeys = new Set();
	}

	bindKeyboardEvents() {
		window.addEventListener('keydown', ({code}) => this.pressedKeys.add(code));
		window.addEventListener('keyup', ({code}) => this.pressedKeys.delete(code));
	}

	draw() {
		const pressedKeys = this.pressedKeys;

		if (pressedKeys.has('ArrowLeft')) {
			this.x -= 8;
		}

		if (pressedKeys.has('ArrowRight')) {
			this.x += 8;
		}

		if (pressedKeys.has('Space')) {
			new Bullet(this.x, this.y, -10);
		}

		if (this.x > (canvasDimensions.width - this.width)) {
			this.x = (canvasDimensions.width - this.width);
		}

		if (this.x < 0) {
			this.x = 0;
		}

		ctx.fillRect(this.x - (this.width / 2), this.y, this.width, this.height);
	}
}

function gameLoop() {

	ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

	ship.draw();

	allBullets.forEach(bullet => bullet.draw());
	allInvaders.forEach(invader => invader.draw());

	requestAnimationFrame(gameLoop);

}

function start() {
	ship = new Spaceship();
	createInvaders();

	gameLoop();
}