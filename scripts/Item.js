class Item {
	constructor(item_id, name, lores, attrs) {
		this.id = item_id;
		this.name = name;
		this.lores = lores;
		this.attrs = attrs;
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
