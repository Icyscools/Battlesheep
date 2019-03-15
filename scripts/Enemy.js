class Enemy extends LivingEntity {
	/*
	 * This is `Enemy` class which extends from `LivingEntity` class
	 *
	 * Enemy object
	 * Define as attacker to player
	 */
	constructor(name, x, y, width, height, sprite_options, hp, atk, def) {
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
		 *  - hp: Health of this object
		 *  - atk: Attack damage of this object
		 *  - def: Defense of this object
		 */

		// This is a child class from `LivingEntity` class, so we need to
		// call super() function to put a parameter to super class
		super(name, x, y, width, height, sprite_options, hp, atk, def, 1);
		this.key = new Set();
		this.faced = "right";
		this.bullets = [];
		this.def = 0;

		this.target = "";
	}

	getTarget() {
		/*
		 * Get this object target to attack
		 */
		return this.target;
	}

	setTarget(target) {
		/*
		 * Set this object target to attack
		 */
		this.target = target;
	}

	render() {
		/*
		 * Render
		 */
		this.context.save();
		if (this.status.isAttacked) {
			this.context.fillStyle = "red";
			this.context.fillRect(this.x, this.y - 5, this.width * (this.getHealth() / this.getMaxHealth()), 5);
		} else {
			this.context.fillStyle = "black";
			this.context.font = "11px Georgia";
			this.context.textAlign = "center";
			this.context.fillText(this.name, this.x + this.width / 2, this.y);
		}
		this.context.restore();

		if (this.getTarget() !== "" && this.getTarget() !== undefined) {
			let target_posX = this.getTarget().getX() + this.getTarget().getWidth() / 2,
			    target_posY = this.getTarget().getY() + this.getTarget().getHeight() / 2,
			    center_posX = this.x + this.width / 2,
			    center_posY = this.y + this.height / 2;
			this.x += target_posX > center_posX ? 1 : (target_posX < center_posX) ? -1 : 0
			this.y += target_posY > center_posY ? 1 : (target_posY < center_posY) ? -1 : 0
		}

		super.render()
	}
}