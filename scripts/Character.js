class Character extends LivingEntity {
	constructor(context, name, x, y, width, height, sprite_options, hp, atk, def) {
		super(context, name, x, y, width, height, sprite_options, hp, atk, def);
		this.key = new Set();
		this.faced = "right";
		this.bullets = [];

		/* Event Listener */
		window.addEventListener('keydown', (e) => this.updateKey(e, 'add'));
		window.addEventListener('keyup', (e) => this.updateKey(e, 'delete'));

		window.addEventListener('click', (e) => this.fireBullet(e))
	}

	updateKey(e, action) {
		if ([65, 68, 87, 83].includes(e.keyCode)) { // A D W S
			if (action === 'add') {
				this.key.add(e.keyCode);
			} else if (action === 'delete') {
				this.key.delete(e.keyCode);
			}
		}
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

	fireBullet(e) {
		let direction = {
			x: e.x - this.x,
			y: e.y - this.y
		}

		//Normalize
		let length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
		direction.x /= length;
		direction.y /= length;

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
								ratio: 1.0,
							},
							this,
							5,
							direction,
							12,
							this.faced
						);
		
		this.bullets.push(bullet);
	}
}