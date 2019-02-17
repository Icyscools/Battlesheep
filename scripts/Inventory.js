class Inventory {
	constructor(owner, items, rows, cols) {
		this.owner = owner;
		this.items = items ? [...items] : [];
		this.slot = rows * cols;
		this.rows = rows;
		this.cols = cols;
		this.UI = new UIInventory(this);
	}

	getOwner() {
		return this.owner;
	}

	getItems() {
		return this.items;
	}

	getItem(row, col) {
		return this.items[row][col] !== undefined ? this.items[row][col] : 0;
	}

	getUI() {
		return this.UI;
	}
}
