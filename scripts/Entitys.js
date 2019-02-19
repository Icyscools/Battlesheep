class Entity {
	/*
	 * This is `Entity` class
	 *
	 * Entity object
	 * Define to eveny object that belong in game
	 */
	constructor(name, x, y, width, height, sprite_options) {
		/*
		 * Constructor
		 * is a function to define new object, class declaration
		 *
		 * It run when a new object is create, use on store a data which
		 * coming in a list of parameter, or use to variable declaration
		 *
		 * Parameter
		 *  - context: Context of canvas
		 *  - name: Name of this object
		 *  - x: Position X of this object
		 *  - y: Position Y of this object
		 *  - width: Width of this object
		 *  - height: Height of this object
		 *  - sprite_option: Sprite option using render sprite image
		 */

		// Store a value from a list of parameter to local variable
		// We used keyword `this` to call local variable (or can call object data)
		this.context = game.getContext();
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

	getContext() {
		return this.context;
	}

	getName() {
		return this.name;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getFaced() {
		return this.faced;
	}

	render() {
		/*
		 * Render the object to the canvas
		 * In this character object
		 */
		this.sprite.update(this.x, this.y, this.faced); // Update sprite
		this.sprite.render(); // Render
	}

	sprite (options) {
		/*
		 * Import sprite image throught this function object
		 *
		 * In `option` parameter accept only a object / JSON
		 * which declare in
		 *  - src (str): Source of sprite image
		 *  - width (int): Width of sprite
		 *  - height (int): Height of sprite
		 *  - ticksPerFrame (int): Tick per frame
		 *  - numberOfFrames (int): Number of frame
		 *  - loop (boolean): Is loop sprite
		 *  - ratio (float): Sprite size ratio
		 *  - flip (str): Flip image -> ("left" : "right") (default is "left")
		 *
		 * And this function object has these method
		 *  - update(pos_x, pos_y, faced) -> Update the parameter of sprite
		 *      pos_x (float): Position X of object
		 *      pos_y (float): Position X of object
		 *      faced (str): Direction of object ("left" or "right")
		 *  - render() -> Render the sprite
		 */
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
			// that.flip = faced.toLowerCase() === "right" ? false : true;
			if (faced === "right") {
				that.flip = "right";
			}
			else if (faced === "left") {
				that.flip = "left";
			}
			else if (faced === "up") {
				that.flip = "up";
			}
			else if (faced === "down") {
				that.flip = "down";
			}
		}

		that.render = function () {
			that.context.save();
			if (that.flip === "right") {
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
			}
			else if (that.flip === "left") {
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
			else if (that.flip === "down") {
				// that.context.scale(-1, -1);
				// that.context.translate(-that.width, -that.height);
				that.context.translate((2 * that.pos_x + that.width) / 2, (2 * that.pos_y + that.height) / 2)
				that.context.rotate(Math.PI / 2)
				that.context.translate(-(2 * that.pos_x + that.width) / 2, -(2 * that.pos_y + that.height) / 2)
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
			}
			else if (that.flip === "up") {
				// that.context.scale(1, -1);
				// that.context.translate(0, -that.height);
				that.context.translate((2 * that.pos_x + that.width) / 2, (2 * that.pos_y + that.height) / 2)
				that.context.rotate(-Math.PI / 2)
				that.context.translate(-(2 * that.pos_x + that.width) / 2, -(2 * that.pos_y + that.height) / 2)
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
			}

			that.context.restore();
			return 0;
		}

		return that;
	}

	collided (obj) {
		/*
		 * Check if this `Entity` object is collide to another `Entity` object
		 * Return
		 *   true : if this `Entity` collide with another `Entity`
		 *   false : if not collide
		 */
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
	/*
	 * This is `Bullet` class which extends from `Entity` class
	 *
	 * Bullet object
	 * Define to any object that make from `Character` object on the game
	 */
	constructor(name, x, y, width, height, sprite_options, owner, velocity, direction, timer, faced) {
		/*
		 * Constructor
		 * is a function to define new object, class declaration
		 *
		 * It run when a new object is create, use on store a data which
		 * coming in a list of parameter, or use to variable declaration
		 *
		 * Parameter
		 *  - name: Name of this object
		 *  - x: Position X of this object
		 *  - y: Position Y of this object
		 *  - width: Width of this object
		 *  - height: Height of this object
		 *  - sprite_option: Sprite option using render sprite image
		 *  - owner: Owner of this object
		 *  - velocity: Velocity of this object
		 *  - direction: Direction of this object
		 *  - timer: Living time of this object
		 *  - faced: Faced of this object
		 */

		// This is a child class from `Entity` class, so we need to
		// call super() function to put a parameter to super class
		super(name, x, y, width, height, sprite_options);
		this.owner = owner;
		this.velocity = velocity;
		this.faced = faced;
		this.timer = timer * 100;
		this.direction = direction;
	}


	getOwner() {
		return this.owner;
	}

	isTimeOut() {
		/*
		 * Check if living time is less than 0
		 */
		return this.timer <= 0;
	}

	isOutFrame() {
		/*
		 * Check if the bullet is out frame
		 */
		return (0 > this.x) || (this.x > this.context.canvas.width);
	}

	render() {
		/*
		 * Render this object
		 * and decrease a living time
		 */
		if (this.faced === 'left') {
			this.x -= this.velocity;
		}

		else if (this.faced === 'right') {
			this.x += this.velocity;
		}

		else if (this.faced === 'up') {
			this.y -= this.velocity
		}
		else if (this.faced === 'down') {
			this.y += this.velocity
		}
		// this.x += this.direction.x * this.velocity;
		// this.y += this.direction.y * this.velocity;
		this.timer -= 1;
		super.render();
	}
}
