class Item {
	constructor(item_id, name, lores, attrs, stackable) {
		this.id = item_id;
		this.name = name;
		this.lores = lores;
		this.attrs = attrs;
		this.stackable = stackable;
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
}

class ItemStack extends Item {
	constructor(item, stack) {
		super(item.id, item.name, item.lores, item.attrs, item.stackable);
		this.amount = stack;
	}

	getAmount() {
		return this.amount;
	}
}