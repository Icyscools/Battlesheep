/*
 * Game.js
 */
class GameBoard {
	constructor(canvasName) {
		this.board = document.getElementById(canvasName);
		this.context = this.board.getContext("2d");
		this.i = 0;

		this.entitys = [];
		this.maps = [];
		this.camera = {
			x: 0,
			y: 0,
			width: this.board.width,
			height: this.board.height
		};
		this.config = {
			width: 854,
			height: 480
		};

		window.addEventListener('resize', (e) => this.resizeCanvas());
	}

	init() {
		this.board.width = this.config.width;
		this.board.height = this.config.height;
		this.resizeCanvas()
		this.character = new Character(
			this.context,
			"Sheep",
			0, 
			0, 
			64, 
			64, 
			{
				src: "assets/character2.png",
				width: 64,
				height: 64,
				ticksPerFrame: 10,
				numberOfFrames: 7,
				loop: true,
				ratio: 1.0
			}
		);

		for (let n = 300; n > 0; n--) {
			let ent = new Entity(
				this.context,
				"Grass #" + n,
				0 + Math.random() * (this.board.width - 32), 
				0 + Math.random() * (this.board.height - 32), 
				32, 
				32, 
				{
					src: "assets/grass.png",
					width: 32,
					height: 32,
					ticksPerFrame: 12,
					numberOfFrames: 3,
					loop: true,
					ratio: 1.0
				}
			);

			/*
			if (this.entitys.some((entity) => entity.collided(ent))) {
				continue
			}*/

			this.entitys.push(ent);
		}

		this.generateMap();
		this.gameUpdate();
	}

	getEntitys() {
		return this.entitys;
	}

	gameUpdate() {
		// Clear screen
		this.context.clearRect(0, 0, this.board.width, this.board.height);

		// Camera update
		this.updateCamera();

		// Background update
		this.drawMap();

		//this.drawRotatedBox(100, 100, 50, 50, this.i);

		// Remove grass when bullet hit
		this.entitys.forEach((ent) => {
			this.character.getBullet().forEach((bullet) => {
				if (bullet.collided(ent)) {
					this.character.getBullet().splice(this.character.getBullet().indexOf(bullet), 1);
					this.entitys.splice(this.entitys.indexOf(ent), 1);
				}
			})
		})

		// Entity update
		this.orderEntitys = [...this.entitys];
		this.orderEntitys.sort(function (a, b) {
			if (a.y > b.y) {
				return 1;
			} else if (a.y < b.y) {
				return -1;
			} else {
				return 0;
			}
		});

		this.orderEntitys.forEach((entity) => {
			entity.render();
		}, this);

		// Character update
		this.character.render();
		this.i++;

		setTimeout(() => {
			this.gameUpdate()
		}, 20);
	}

	updateCamera() {
		this.camera.x = this.character.x - (this.camera.width / 2);
		this.camera.y = this.character.y - (this.camera.height / 2);
	}

	generateMap() {
		this.maps = []
		for (let r = 0; r < this.board.height / 20; r++) {
			let rows = []
			for (let c = 0; c < this.board.width / 20; c++) {
				rows.push(randomColor("Blue"));
			}
			this.maps.push(rows)
		}
		console.log(this.maps)
	}

	drawMap() {
		// Legacy
		this.context.save();
		this.context.fillStyle = "#1e7c3e";
		this.context.fillRect(0, 0, this.board.width, this.board.height);
		this.context.restore();
		
		/*
		for (let r = 0; r < this.board.height / 20; r++) {
			for (let c = 0; c < this.board.width / 20; c++) {
				this.context.fillStyle = this.maps[r][c];
				this.context.fillRect(c * 20, r * 20, 20, 20);		
			}
		}*/

		let tileSize = 20;
		var onXTile = Math.floor((this.camera.x + (this.camera.width / 2)) / tileSize);
		var onYTile = Math.floor((this.camera.y + (this.camera.height / 2)) / tileSize);
		
	}

	drawRotatedBox(x, y, width, height, angle) { 
		this.context.save();
		this.context.translate(x, y);
		this.context.rotate(angle * Math.PI / 180);
		this.context.fillStyle = "red";
		this.context.fillRect(-width/2, -height/2, width, height);
		this.context.restore(); 
	}

	resizeCanvas() {
	  	this.board.style.width = window.innerWidth + "px";
  		this.board.style.height = window.innerHeight + "px";
	  	console.log(this.board.style.width, this.board.style.height);
	};
}

class Entity {
	constructor(context, name, x, y, width, height, sprite_options) {
		this.context = context;
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.sprite_options = sprite_options;
		this.faced = "right"

		var entityImg = new Image();
		entityImg.src = sprite_options.src;
			
		this.sprite = this.sprite({
			context: this.context,
			width: sprite_options.width,
			height: sprite_options.height,
			image: entityImg,
			ticksPerFrame: sprite_options.ticksPerFrame,
			numberOfFrames: sprite_options.numberOfFrames,
			loop: sprite_options.loop,
			ratio: sprite_options.ratio
		});
	}

	render() {
		this.sprite.update(this.x, this.y, this.faced);
		this.sprite.render();
	}

	sprite (options) {
		let that = {
				x: 0,
				y: 0
			},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0, 
			numberOfFrames = options.numberOfFrames || 1,
			ratio = options.ratio || 1.0;

		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		that.loop = options.loop;
		that.flip = options.flip || false;

		that.update = function (pos_x, pos_y, faced) {
			tickCount += 1;
			if (tickCount > ticksPerFrame) {
				tickCount = 0;
				if (frameIndex < numberOfFrames - 1) {
					frameIndex += 1;
				} else if (that.loop) {
					frameIndex = 0;
				}
			}
			that.pos_x = pos_x;
			that.pos_y = pos_y;
			that.flip = faced.toLowerCase() === "right" ? false : true;
		}

		that.render = function () {
			that.context.save();
			if (!that.flip) {
				that.context.drawImage(
					that.image,
					frameIndex * that.width,
					0,
					that.width,
					that.height,
					that.pos_x,
					that.pos_y,
					that.width * ratio,
					that.height * ratio
				);
			} else {
				that.context.scale(-1, 1);
				that.context.translate(-that.width, 0);
				that.context.drawImage(
					that.image,
					frameIndex * that.width,
					0,
					that.width,
					that.height,
					-that.pos_x,
					that.pos_y,
					that.width * ratio,
					that.height * ratio
				);
			}
			that.context.restore();
			return 0;
		}

		return that;
	}

	collided (obj, check=false) {
		let entity = {
			left: obj.x,
			right: obj.x + obj.width,
			top: obj.y,
			bottom: obj.y + obj.height
		}

		return ((this.x < entity.right) &&
                (this.y < entity.bottom) &&
                (this.x + this.width > entity.left) &&
                (this.y + this.height > entity.top)) ? true : false
	}
}

class Bullet extends Entity {
	constructor(context, name, x, y, width, height, sprite_options, owner, velocity, timer, faced) {
		super(context, name, x, y, width, height, sprite_options);
		this.owner = owner;
		this.velocity = velocity;
		this.faced = faced;
		this.timer = timer * 100;
	}

	isTimeOut() {
		return this.timer <= 0;
	}

	isOutFrame() {
		return (0 > this.x) || (this.x > this.context.canvas.width);
	}

	render() {
		this.x = this.x + this.velocity;
		this.timer -= 1;
		super.render();
	}
}


class Character extends Entity {
	constructor(context, name, x, y, width, height, sprite_options, gravity) {
		super(context, name, x, y, width, height, sprite_options, gravity);
		this.key = new Set();
		this.faced = "right";
		this.bullets = [];

		/* Event Listener */
		window.addEventListener('keydown', (e) => this.updateKey(e, 'add'));
		window.addEventListener('keyup', (e) => this.updateKey(e, 'delete'));
	}

	updateKey(e, action) {
		if ([65, 68, 87, 83].includes(e.keyCode)) { // A D W S
			if (action === 'add') {
				this.key.add(e.keyCode)
			} else if (action === 'delete') {
				this.key.delete(e.keyCode)
			}
		} else if ()
	}

	render() {
		let speed = 4;
		if (this.key.has(65)) {
			this.x = Math.max(this.x - speed, 0);
			this.faced = "left";
		}
		if (this.key.has(68)) {
			this.x = Math.min(this.x + speed, this.context.canvas.width - this.sprite_options.width * this.sprite_options.ratio);
			this.faced = "right";
		}
		if (this.key.has(87)) {
			this.y = Math.max(this.y - speed, 0);
		}
		if (this.key.has(83)) {
			this.y = Math.min(this.y + speed, this.context.canvas.height - this.sprite_options.height * this.sprite_options.ratio);
		}

		this.context.strokeStyle="blue";
		this.context.beginPath();
		this.context.rect(this.x - (this.width / 2), this.y - (this.height / 2), this.width * 2, this.height * 2, 0);
		this.context.lineWidth=1;
		this.context.stroke();
		this.context.restore();

		this.bullets.forEach((bullet) => {
			if (bullet.isTimeOut() || bullet.isOutFrame()) {
				this.bullets.splice(this.bullets.indexOf(bullet), 1);
			} else {
				bullet.render();
			}
		})

		super.render();
	}

	getBullet() {
		return this.bullets;
	}

	fireBullet() {
		let bullet = new Bullet(
							this.context,
							"Bullet",
							this.x + (this.faced === "left" ? 0 : (this.width * 2/3)),
							this.y + (this.height * 2/3) + (10 * Math.random() * (Math.random() > 0.5 ? -1 : 1)),
							13,
							13,
							{
								src: "assets/bullet.png",
								width: 13,
								height: 13,
								ticksPerFrame: 10,
								numberOfFrames: 2,
								loop: true,
								ratio: 1.0
							},
							this,
							(this.faced === "left" ? -1 : 1) * 5,
							12,
							this.faced
						);
		
		this.bullets.push(bullet);
	}
}

function randomColor(tone="Red") {
	colorCode = "0123456789ABCDEF"
	color = "#"
	for (let i = 0; i < 3; i++) {
		if (i == 0 && tone === "Red") {
			color += "F" + colorCode[Math.floor(Math.random() * 16)]
		} else if (i == 1 && tone === "Green") {
			color += (Math.random() >= 0.5 ? "F" : "E") + colorCode[Math.floor(Math.random() * 16)]
		} else if (i == 2 && tone === "Blue") {
			color += "F" + colorCode[Math.floor(Math.random() * 16)]
		} else {
			color += colorCode[Math.max(2, Math.floor(Math.random() * 13))] + colorCode[Math.floor(Math.random() * 16)]
		}
	}
	return color
}

const game = new GameBoard("GameBoard");
game.init();
