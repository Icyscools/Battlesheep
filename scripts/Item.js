class Item {
	constructor(item_id, name, lores, attrs, category) {
		this.id = item_id;
		this.name = name;
		this.lores = lores;
		this.attrs = attrs;
		this.stackable = false;
		this.category = category;
	}

	getItemId() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	getLores() {
		return this.lores;
	}

	getAttribute() {
		return this.attrs;
	}

	isStackable() {
		return this.stackable;
	}

	isSame(item) {
		for (let attr in this.getAttribute()) {
			if (item.getAttribute()[attr] == undefined) return false;
			if (this.getAttribute()[attr] != item.getAttribute()[attr]) {
				console.log(false);
				return false;
			}
		}

		return (this.getItemId() == item.getItemId() &&
				this.getName() == item.getName() &&
				this.getLores() == item.getLores() &&
				this.isStackable() == item.isStackable());
	}
}

class ItemStack extends Item {
	constructor(item, stack) {
		super(item.id, item.name, item.lores, item.attrs, item.category);
		this.stackable = true;
		this.amount = stack;
	}

	setAmount(amount) {
		this.amount += amount;
	}

	getAmount() {
		return this.amount;
	}
}

function ItemGenerator() {
	let item_id, name, attr = {};

	item_id = zeroPadding((Math.floor(Math.random() * 9) + 1), 4);
	name = random_name[Math.floor(Math.random() * random_name.length)] + " Sword";
	attr.atk = Math.random() * 20

	return new Item(item_id, name, "", attr, "sword");
}

function zeroPadding(num, length) {
	let str = num.toString();
	let needFill = length - str.length;

	while (needFill > 0) {
		str = "0" + str;
		needFill -= 1;
	}
	return str;
}

const random_name = [
	"Broken",
	"Normal",
	"Well",
	"Great",
	"Excellent"
]

const attribute_prefix = {
	"atk": "Atk. Damage: %d",
	"def": "Defense: %d",
	"regenHP": "Regen %d Health"
}