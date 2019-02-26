class LivingEntity extends Entity {
	/*
	 * This is `LivingEntity` class which extends from `Entity` class
	 *
	 * LivingEntity object
	 * Define to any creature on the game
	 */
	constructor(name, x, y, width, height, sprite_options, hp, atk, def, atkspd) {
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
		 *  - atkspd: Attack speed of this object
		 */

		// This is a child class from `Entity` class, so we need to
		// call super() function to put a parameter to super class
		super(name, x, y, width, height, sprite_options);
		this.hp = hp;
		this.maxhp = hp;
		this.atk = atk;
		this.def = def;
		this.atkspd = atkspd;
		this.state = "idle";
	}

	getHealth() {
		/*
		 * Get current health of this object
		 */
		return this.hp;
	}

	getMaxHealth() {
		/*
		 * Get max health of this object
		 */
		return this.maxhp;
	}

	getAttackDamage() {
		/*
		 * Get attack damage of this object
		 */
		return this.atk;
	}

	getAttackSpeed() {
		/*
		 * Get attack speed of this object
		 */
		return this.atkspd;
	}

	getDefense() {
		/*
		 * Get defense of this object
		 */
		return this.def;
	}

	isDamage() {
		/*
		 * Check if this object have been recieved damage recently
		 */
		return this.state == "hit";
	}

	giveDamage(damage, damager) {
		/*
		 * Give damage to this object
		 */
		this.hp = Math.max(this.hp - Math.max(damage - this.def, 1), 0);

		if (damager !== undefined && this instanceof Enemy) {
			this.state = "hit";
			this.setTarget(damager);
		}
	}

	isDead() {
		/*
		 * Check if this object is died
		 */
		return this.hp <= 0;
	}

	setDead() {
		/*
		 * Set health of this object to -99999
		 * to make it died
		 */
		this.hp = -99999;
	}
}