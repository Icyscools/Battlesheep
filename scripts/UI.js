class UI {
	constructor(options) {
		this.root = options.root !== undefined ? options.root : document.getElementById("interface");
		this.name = options.name !== undefined ? options.name : "Untitled";
		this.id = options.id !== undefined ? options.id : 0;
		this.class = options.class !== undefined ? options.class : 0;
		this.width = options.width !== undefined ? options.width : 0;
		this.height = options.height !== undefined ? options.height : 0;
		this.padding = options.padding !== undefined ? options.padding : 0;
		this.isPanel = options.isPanel !== undefined ? options.isPanel : false;
		this.showName = options.showName !== undefined ? options.showName : false;
		this.isShow = options.isShow !== undefined ? options.isShow : true;
		this.dragAble = options.dragAble !== undefined ? options.dragAble : false;
		this.game_identity = game.identity
		this.ui = 0;
		this.pos = {
			x: 0,
			y: 0
		};
	}

	createUI() {
		let ui = document.createElement("div");
		this.ui = ui;
		if (this.id) this.ui.setAttribute("id", this.id);
		if (this.class) this.ui.setAttribute("class", this.class);
		if (this.showName) {
			let header = document.createElement("div");
			header.setAttribute("class", "header");
			header.innerText = this.name.capitalize();
			this.ui.appendChild(header);
		}
		if (this.width) this.ui.style.width = this.width + "px";
		if (this.height) this.ui.style.height = this.height + "px";
		if (this.padding) this.ui.style.padding = this.padding + "px";
		if (this.isPanel) this.root.appendChild(this.ui);
		if (this.dragAble) {
			this.dragObject(this.ui);
		}

		this.isShow ? this.showUI() : this.hideUI();

		this.setPosition(100, 200);
		return ui;
	}

	deleteUI(ui) {
		this.root.removeChild(ui);
		return 1;
	}

	getUI() {
		return this.ui;
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

	appendUI(anotherUI) {
		this.ui.appendChild(anotherUI.getUi());
	}

	setPosition(x, y) {
		this.ui.style.top = y + "px";
		this.ui.style.left = x + "px";
	}

	dragObject(ui) {
		var element = ui;

		var pos1 = 0,
		    pos2 = 0,
		    pos3 = 0,
		    pos4 = 0;

		let header = element.querySelector(".header");
		if (header !== undefined) {
			header.addEventListener("mousedown", (e) => dragMouseDown(e));
			header.classList.add("draggable");
		} else {
			element.addEventListener("mousedown", (e) => dragMouseDown(e));
			element.classList.add("draggable");
		}

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();

			pos3 = e.clientX;
			pos4 = e.clientY;
		    console.log(element);
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
			
		}

		function elementDrag(e) {
			e = e || window.event;
		    e.preventDefault();
		    // calculate the new cursor position:
		    pos1 = pos3 - e.clientX;
		    pos2 = pos4 - e.clientY;
		    pos3 = e.clientX;
		    pos4 = e.clientY;
		    // set the element's new position:
		   	element.style.top = (element.offsetTop - pos2) + "px";
		    element.style.left = (element.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
		    // stop moving when mouse button is released:
		    document.onmouseup = null;
		    document.onmousemove = null;
		}
	}
}

class UIPlayerStatus extends UI {
	constructor(character) {
		super({
			name: "player status",
			id: "player_status",
			isPanel: true,
			isShow: false,
			showName: true,
			dragAble: true,
			padding: 5
		})
		this.character = character;

		this.UI = this.createUI();
		this.UI.style.textAlign = "center";

		this.player_panel = document.createElement("div");
		this.player_panel.setAttribute("id", "player_status");

		this.UI.appendChild(this.player_panel);
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
			dragAble: true,
			padding: 5
		});

		this.inventory = inventory;

		this.UI = this.createUI();
		this.UI.style.textAlign = "center";

		this.inv_table = document.createElement("table");
		this.inv_table.setAttribute("id", "player_inventory");
		this.updateInventory();

		this.UI.appendChild(this.inv_table);
	}

	updateInventory() {
		this.inv_table.innerHTML = "";
		for (let r = 0; r < this.inventory.rows; r++) {
			let row = this.inv_table.insertRow(r);
			for (let c = 0; c < this.inventory.cols; c++) {
				let cell = row.insertCell(c);
				let item = this.inventory.getItem(r, c);
				
				/* Initialize the slot */
				cell.id = "inventory_slot";
				cell.setAttribute("slot", r * 9 + c);
				cell.style.width = "32px";
				cell.style.height = "32px";
				
				if (item !== undefined && item !== 0) {
					let el_item = new UIItem(item, r * 9 + c);
					cell.appendChild(el_item.getUI());
				} else {
					cell.innerHTML = `<img src="assets\\items\\0000.png">`;
				}

				/* Add Event listener to cell */
				cell.addEventListener("dragover", function (e) {
					e.preventDefault();
				});

				let inventory = this.inventory;
				cell.addEventListener("drop", function (e) {
					e.preventDefault();
					let data = e.dataTransfer.getData("from-item-slot");
					inventory.swapItem(data, this.getAttribute("slot"));
				});
			}
		}
	}

	toggleUI() {
		this.updateInventory();
		super.toggleUI();
	}

	getInventory() {
		return this.inventory;
	}
}

class UIItem extends UI {
	constructor(item, slot) {
		super({
			name: "item",
			class: "item",
			padding: 0,
			width: 32,
			height: 32,
			showName: false
		});
		this.item = item;
		this.slot = slot;

		this.UI = this.createUI();
		this.UI.style.cursor = "pointer";

		this.item_element = document.createElement("img");
		this.item_element.setAttribute("itemId", this.item.getItemId());
		this.item_element.setAttribute("title", `${this.item.getName()}\u000dDamage: ${this.item.getAttribute().atk}`);
		this.item_element.src = `assets\\items\\${item.getItemId()}.png`;

		/* Add Event Listener - On Drag & Drop Event */
		this.item_element.addEventListener("dragstart", function (e) {
			console.log(e);
			e.dataTransfer.setData("from-item-slot", slot);
		});

		this.item_element.addEventListener("dragover", function (e) {
			e.preventDefault();
			console.log(e);
		});
		this.item_element.addEventListener("drop", function (e) {
			console.log(e);
		});

		this.item_element.addEventListener("mouseover", (e) => this.getDetail());

		this.UI.appendChild(this.item_element);
		//this.UI.addEventListener("drag", (e) => console.log(e));
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
		super({
			class: "textbox",
			isPanel: true
		});

		this.text = "";
		this.ui = this.createUI();

		this.setText(text);
		this.setPosition(300, 400);
		this.deleteUI();
	}

	deleteUI() {
		super.deleteUI(this.ui);
	}

	setText(text) {
		this.text = text;
		this.ui.innerHTML = this.text;
	}
}

class UIHealthBar extends UI {
	constructor(character) {
		super({
			id: "healthbar",
			isPanel: true,
			width: 280,
			height: 45
		});

		this.character = character;
		this.ui = this.createUI();
		this.ui.innerText = this.character.getName();

		this.hpbar = document.createElement("div");
		this.hpbar.classList.add("bar");
		this.hpbar.id = "healthbar";

		this.health = document.createElement("div");
		this.health.classList.add("health");
		this.hpbar.appendChild(this.health);

		this.hp_text = document.createElement("span");
		this.hp_text.classList.add("floatText")
		this.hpbar.appendChild(this.hp_text);

		this.ui.appendChild(this.hpbar);

		this.expbar = document.createElement("div");
		this.expbar.classList.add("bar");
		//this.ui.appendChild(this.bar);

		this.setPosition(0, 0);
		this.render();

	}

	render() {
		//this.ui.innerText = `HP : ${this.character.getHealth()} / ${this.character.getMaxHealth()}`
		this.health.style.width = `${this.character.getHealth() / this.character.getMaxHealth() * 100}%`;

		if (this.character.getHealth() <= 30) {
			document.querySelector('#interface > #healthbar > .bar > .health').style.animation = "blink .2s step-end infinite alternate";
		}
		
		this.hp_text.style.top = "0px";
		this.hp_text.innerText = `HP : ${this.character.getHealth()} / ${this.character.getMaxHealth()}`;

		setTimeout(() => {
			if (this.game_identity == config.identity) 
				this.render();
		}, config.gameTick);
	}
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
