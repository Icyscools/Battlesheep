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

class LivingEntity extends Entity {
	constructor(context, name, x, y, width, height, sprite_options, hp, atk, def) {
		super(context, name, x, y, width, height, sprite_options);
		this.hp = hp;
		this.atk = atk;
		this.def = def;
		this.state = "idle";
	}

	getAttack() {
		return this.atk;
	}

	getDefense() {
		return this.def;
	}

	isDead() {
		return this.hp <= 0;
	}

	setDead() {
		this.hp = -99999;
	}
}

class Bullet extends Entity {
	constructor(context, name, x, y, width, height, sprite_options, owner, velocity, direction, timer, faced) {
		super(context, name, x, y, width, height, sprite_options);
		this.owner = owner;
		this.velocity = velocity;
		this.faced = faced;
		this.timer = timer * 100;
		this.direction = direction
	}

	isTimeOut() {
		return this.timer <= 0;
	}

	isOutFrame() {
		return (0 > this.x) || (this.x > this.context.canvas.width);
	}

	render() {
		this.x += this.direction.x * this.velocity;
		this.y += this.direction.y * this.velocity;
		this.timer -= 1;
		super.render();
	}
}
