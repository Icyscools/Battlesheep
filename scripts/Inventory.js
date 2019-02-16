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
		return row * col < this.items.length ? this.items[row][col] : 0;
	}

	getUI() {
		return this.UI;
	}
}
