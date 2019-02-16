class UI {
	constructor(options) {
		this.root = document.getElementById("interface");
		console.log(options);
		this.name = options.name !== undefined ? options.name : "Untitled";
		this.id = options.id !== undefined ? options.id : 0;
		this.class = options.class !== undefined ? options.class : 0;
		this.width = options.width !== undefined ? options.width : 0;
		this.height = options.height !== undefined ? options.height : 0;
		this.padding = options.padding !== undefined ? options.padding : 0;
		this.isPanel = options.isPanel !== undefined ? options.isPanel : false;
		this.showName = options.showName !== undefined ? options.showName : false;
		this.isShow = options.isShow !== undefined ? options.isShow : true;
		this.ui = 0;
	}

	createUI() {
		let ui = document.createElement("div");
		this.ui = ui;
		if (this.id) this.ui.setAttribute("id", this.id);
		if (this.class) this.ui.setAttribute("class", this.class);
		if (this.showName) this.ui.innerText = this.name.capitalize();
		if (this.width) this.ui.style.width = this.width + "px";
		if (this.height) this.ui.style.height = this.height + "px";
		if (this.padding) this.ui.style.padding = this.padding + "px";
		if (this.isPanel) this.root.appendChild(this.ui);
		this.isShow ? this.showUI() : this.hideUI();
		return ui;
	}

	deleteUI(ui) {
		this.root.removeChild(ui);
		return 1;
	}

	getUI() {
		return this.UI;
	}

	showUI() {
		this.isShow = true;
		this.ui.style.display = "block";
	}

	hideUI() {
		this.isShow = false;
		this.ui.style.display = "none";
	}

	toggleUI() {
		this.isShow = !this.isShow;
		this.isShow ? this.showUI() : this.hideUI();
	}

	dragElement(element) {
		return 0;
	}
}

class UIInventory extends UI {
	constructor(inventory) {
		super({
			name: "inventory",
			id: "inventory",
			isPanel: true,
			isShow: false,
			showName: true,
			padding: 5
		});

		this.inventory = inventory;

		this.UI = this.createUI();
		this.UI.style.cursor = "move";
		this.UI.style.textAlign = "center";

		this.inv_table = document.createElement("table");
		this.inv_table.setAttribute("id", "player_inventory");
		for (let r = 0; r < this.inventory.rows; r++) {
			let row = this.inv_table.insertRow(r);
			for (let c = 0; c < this.inventory.cols; c++) {
				let cell = row.insertCell(c);
				let item = this.inventory.getItem(r, c);
				if (item !== undefined) {
					let el_item = new UIItem(item);
					cell.appendChild(el_item.getUI());
				} else {
					cell.innerHTML = `<img src="assets\\items\\0000.png">`;
				}
			}
		}
		this.UI.appendChild(this.inv_table);
	}

	getInventory() {
		return this.inventory;
	}
}

class UIItem extends UI {
	constructor(item) {
		super({
			name: "item",
			class: "item",
			padding: 0,
			width: 32,
			height: 32,
			showName: false
		});
		this.item = item;

		this.UI = this.createUI();
		this.UI.style.cursor = "pointer";

		this.item_element = document.createElement("img");
		this.item_element.setAttribute("itemId", this.item.getItemId());
		this.item_element.src = `assets\\items\\${item.getItemId()}.png`;

		this.UI.appendChild(this.item_element);

		this.UI.addEventListener("mouseover", (e) => this.getDetail());
	}

	getItem() {
		return this.item;
	}

	getDetail() {
		console.log(this.item.getName());
	}
}

class UITextBox extends UI {
	constructor(text) {
		this.text = text;
	}
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
