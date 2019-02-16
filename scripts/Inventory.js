class Inventory {
	constructor(owner, items, rows, cols) {
		this.onwer = owner;
		this.items = items ? [...items] : [];
		this.slot = rows * cols;
		this.UI = new UIInventory(this);
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

class Items {
	constructer(item_id, name, lores, attrs) {
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

class UIInventory {
	constructer(inventory) {
		this.inventory = inventory;

		this.inv_table = document.createElement("TABLE");
		this.inv_table.setAttribute("id", "player_inventory")
		for (let r = 0; r < this.inventory.rows; r++) {
			let row = this.inv_table.insertRow(r)
			for (let c = 0; c < this.inventory.cols; c++) {
				let cell = this.inv_table.insertCell(c)
				let item = this.inventory.getItem(r, c)
				if (item != 0) {
					cell.innerHTML = `<img src="assets\items\${item.getItemId()}.png" width="32" height="32">`
				} else {
					cell.innerHTML = `<img src="assets\items\\0000.png" width="32" height="32">`		
				}
			}
		}
		console.log("test\n")
		alert(this.inv_table)
	}

	showTable() {
		this.inv_table.style.visibility = "visible";
	}

	hideTable() {
		this.inv_table.style.visibility = "hidden";
	}
}