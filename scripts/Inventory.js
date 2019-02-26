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

	getItemBySlot(slot) {
		return (this.storages[slot / this.cols][slot % this.cols] !== undefined && this.storages[slot / this.cols][slot % this.cols] !== 0) ? this.storages[slot / this.cols][slot % this.cols] : 0;
	}

	getUI() {
		return this.UI;
	}

	swapItem(slot, to_slot) {
		let first_item = {"row": Math.floor(slot / this.cols), "col": slot % this.cols};
		let second_item = {"row": Math.floor(to_slot / this.cols), "col": to_slot % this.cols};

		let temp = this.getItem(first_item.row, first_item.col);
		this.addItem(this.getItem(second_item.row, second_item.col), first_item.row, first_item.col);
		this.addItem(temp, second_item.row, second_item.col);

		this.UI.updateInventory();
	}

	addItem(item, row, col) {
		this.storages[row][col] = item;
		console.log(this.storages)
	}
}
