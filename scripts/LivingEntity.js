class LivingEntity extends Entity {
	/*
	 * This is `LivingEntity` class which extends from `Entity` class
	 *
	 * LivingEntity object
	 * Define to any creature on the game
	 */
	constructor(name, x, y, width, height, sprite_options, hp, atk, def, atkspd, velocity, acceralation) {
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
		this.velocity = velocity;
		this.acceralation = acceralation;
		this.status = {
			isAttacked: false,
			isAttacking: false,
			isInvincible: false,
		};
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

	getStatus() {
		/*
		 * Get status of this object
		 */
		return this.status;
	}

	giveDamage(damage, damager) {
		/*
		 * Give damage to this object
		 *
		 */
		if (!this.status.isInvincible) {
			this.hp = Math.max(this.hp - Math.max(damage - this.def, 1), 0);
			this.status.isAttacked = true;
			if (damager !== undefined && this instanceof Enemy && !this.status.isInvincible) {
				this.status.state = "aggressive";
				this.setTarget(damager);
			}

			let event;
			if (this instanceof Character) {
				if (this.isDead()) {
					event = new CustomEvent("CharacterDied", {
						bubbles: true,
						detail: {
							lastDamager: damager
						}
					})
					window.dispatchEvent(event);
				}

				event = new CustomEvent('CharacterOnDamage', {
					bubbles: true,
					detail: {
						damage: damage,
						damager: damager
					}
				});
				window.dispatchEvent(event);
			} else {
				if (this.isDead()) {
					let loot = new Item("0100", "Red Potion", "", {"regenHP" : 15});
					damager.inventory.appendItem(loot);

					event = new CustomEvent("EntityDied", {
						bubbles: true,
						detail: {
							lastDamager: damager
						}
					})

					window.dispatchEvent(event);
				}
				
				event = new CustomEvent('EntityOnDamage', {
					bubbles: true,
					detail: {
						damage: damage,
						damager: damager
					}
				});
				window.dispatchEvent(event);
			}
		}
	}

	isAlive() {
		/*
		 * Check if this object is alived
		 */
		return this.hp > 0;
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

	setHealth(hp) {
		/*
		 * Set Health of this object via parameter hp
		*/
		this.hp = hp;
	}
}