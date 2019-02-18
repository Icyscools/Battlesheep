class Character extends LivingEntity {
	/*
	 * This is `Character` class which extends from `LivingEntity` class
	 *
	 * Player object
	 * Define to playable object for player
	 */
	constructor(context, name, x, y, width, height, sprite_options, hp, atk, def) {
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
		 *  - hp: Health of this object
		 *  - atk: Attack damage of this object
		 *  - def: Defense of this object
		 */

		// This is a child class from `LivingEntity` class, so we need to
		// call super() function to put a parameter to super class
		super(context, name, x, y, width, height, sprite_options, hp, atk, def, 1);
		this.key = new Set();
		this.faced = "right";
		this.bullets = [];

		/* Inventory (Not finish) */ 
		let item = new Item("0001", "Newbie's Sword", "", {"atk": 30});
		this.inventory = new Inventory(this, 2, 9, {});
		this.inventory.addItem(item, 1, 2);

		let textbox = new UITextBox("test");
		let healthBar = new UIHealthBar(this);

		/* Event Listener */
		window.addEventListener('keydown', (e) => this.updateKey(e, 'add'));
		window.addEventListener('keyup', (e) => this.updateKey(e, 'remove'));

		// window.addEventListener('touchstart', (e) => this.fireBullet()); Tablet supported
		// window.addEventListener('click', (e) => this.fireBullet(e)); PC supported
	}

	updateKey(e, action) {
		/*
		 * Run when player press a keys 
		 * It's use to trigger a event or control a controller
		 */
		if ([65, 68, 87, 83].includes(e.keyCode)) { // A D W S
			if (action === 'add') {
				this.key.add(e.keyCode);
			} else if (action === 'remove') {
				this.key.delete(e.keyCode);
			}
		} else if ([74, 75, 76].includes(e.keyCode)) {
			if (action === 'add') {
				this.fireBullet(e);
			}
		} else if ([73].includes(e.keyCode)) {
			if (action === 'add') {
				let ui = this.inventory.getUI();
				ui.toggleUI();
			}
		}
	}

	render() {
		/*
		 * Render the object to the canvas
		 * In this character object
		 *
		 * We will check the direction that the key press
		 * to move the character on that direction
		 *
		 */
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
			this.faced = "up";
		}
		if (this.key.has(83)) {
			this.y = Math.min(this.y + speed, this.context.canvas.height - this.sprite_options.height * this.sprite_options.ratio);
			this.faced = "down";
		}

		// Draw Rectangle around the character; Can remove this
		this.context.strokeStyle="blue";
		this.context.beginPath();
		this.context.rect(this.x - (this.width / 2), this.y - (this.height / 2), this.width * 2, this.height * 2, 0);
		this.context.lineWidth=1;
		this.context.stroke();
		this.context.restore();

		this.bullets.forEach((bullet) => {
			// If bullet is time out or bullet is out frame
			// then remove it from stored
			if (bullet.isTimeOut() || bullet.isOutFrame()) {
				this.bullets.splice(this.bullets.indexOf(bullet), 1);
			} else {
				bullet.render();
			}
		})

		super.render();
	}

	getBullet() {
		/*
		 * Get bullets object that this character shoot 
		 */
		return this.bullets;
	}

	fireBullet(e) {
		/*
		 * Fire a bullet to belong a direction
		 */
		let direction = {
			x: this.x,
			y: this.y
		}

		// Normalize to get a direction
		let length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
		direction.x /= length;
		direction.y /= length;

		// Create a new bullet object
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
							10,			// velocity
							direction,
							12,
							this.faced
						);
		
		// Store new bullet object to ArrayList
		this.bullets.push(bullet);
	}
}