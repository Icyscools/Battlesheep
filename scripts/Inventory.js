class Inventory {
	constructor(owner, rows, cols, attribute) {
		this.owner = owner;
		this.slot = rows * cols;
		this.rows = rows;
		this.cols = cols;
		this.storages = attribute.storages ? [...attribute.storages] : this.createEmptyInventory();
		this.UI = new UIInventory(this);
	}

	createEmptyInventory() {
		let inventory = [];
		for (let r = 0; r < this.rows; r++) {
			let row = []
			for (let c = 0; c < this.cols; c++) {
				row.push(0);
			}
			inventory.push(row);
		}
		return inventory;
	}

	getOwner() {
		return this.owner;
	}

	getItems() {
		return this.storages;
	}

	getItem(row, col) {
		return (this.storages[row][col] !== undefined && this.storages[row][col] !== 0) ? this.storages[row][col] : 0;
	}

	getUI() {
		return this.UI;
	}

	addItem(item, row, col) {
		this.storages[row][col] = item;
		console.log(this.storages)
	}
}
