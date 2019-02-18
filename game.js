/*
 * Game.js
 * THIS IS MAIN SOURCE JS
 */
class GameBoard {
	/*
	 *	This is class "GameBoard"
	 *  Define as main game board
	 */
	constructor(canvasName) {
		/*
		 * Constructor
		 * เป็นฟังก์ชันที่เอาไว้ใช้ กำหนดว่า class นี้
		 * ต้องสร้างจะต้องมี parameter อะไร สร้างตัวแปรอะไรบ้ง
		 */
		this.board = document.getElementById(canvasName);
		this.context = this.board.getContext("2d");
		this.i = 0;

		this.entitys = [];
		this.maps = [];
		this.camera = {
			x: 0,
			y: 0,
			width: this.board.width,
			height: this.board.height
		};
		this.config = {
			width: 1366,
			height: 768
		};

		this.resizeCanvas();
		window.addEventListener('resize', (e) => this.resizeCanvas());
	}

	showInterface() {
		/*
		 * โชว์ Interface menu (ปุ่มเริ่มเกม)
		 *
		 */
		document.getElementById("menu").style.display = "block";
		return 1;
	}

	hiddenInterface() {
		/*
		 * ซ่อน Interface menu (ปุ่มเริ่มเกม)
		 *
		 */
		document.getElementById("menu").style.display = "none";
		return 0;
	}

	init() {
		/*
		 * ตั้งค่าพื้นฐาน เพื่อเริ่มเกม
		 *
		 */
		this.board.width = this.config.width;
		this.board.height = this.config.height;
		this.hiddenInterface();
		this.resizeCanvas()
		this.character = new Character(
			this.context,
			"Sheep",
			0, 
			0, 
			64, 
			64, 
			{
				src: "assets/character2.png",
				width: 64,
				height: 64,
				ticksPerFrame: 10,
				numberOfFrames: 7,
				loop: true,
				ratio: 1.0
			},
			100,
			5,
			5
		);

		for (let n = 300; n > 0; n--) {
			let ent = new Entity(
				this.context,
				"Grass #" + n,
				0 + Math.random() * (this.board.width - 32), 
				0 + Math.random() * (this.board.height - 32), 
				32, 
				32, 
				{
					src: "assets/grass.png",
					width: 32,
					height: 32,
					ticksPerFrame: 12,
					numberOfFrames: 3,
					loop: true,
					ratio: 1.0
				}
			);

			/*
			if (this.entitys.some((entity) => entity.collided(ent))) {
				continue
			}*/

			this.entitys.push(ent);
		}

		this.generateMap();
		this.gameUpdate();
	}

	getEntitys() {
		/*
		 * Return Object Entity ทั้งหมดที่อยู่ในเกม
		 *
		 */
		return this.entitys; // เป็น ArrayList ที่เก็บ object Entity ในเกม ต้องอัพเดตมันตลอดเวลาจะเพิ่ม / ลบ Entity อะไร
	}

	gameUpdate() {
		/*
		 * ในทุกๆ tick จะทำการ update เกม ซึ่ง function นี้จะทำเรียกตัวเองซ้ำๆ
		 * เพื่ออัพเดตข้อมูลในเกม (การเคลื่อนที่ตัวละคร object)
		 *
		 */

		// Clear screen
		this.context.clearRect(0, 0, this.board.width, this.board.height);

		// Camera update
		this.updateCamera();

		// Background update
		this.drawMap();

		//this.drawRotatedBox(100, 100, 50, 50, this.i);

		// Remove grass when bullet hit
		this.entitys.forEach((ent) => {
			this.character.getBullet().forEach((bullet) => {
				if (bullet.collided(ent)) {
					this.character.getBullet().splice(this.character.getBullet().indexOf(bullet), 1);
					this.entitys.splice(this.entitys.indexOf(ent), 1);
				}
			})
		})

		// Entity update
		this.orderEntitys = [...this.entitys];
		this.orderEntitys.sort(function (a, b) {
			if (a.y > b.y) {
				return 1;
			} else if (a.y < b.y) {
				return -1;
			} else {
				return 0;
			}
		});

		this.orderEntitys.forEach((entity) => {
			entity.render();
		}, this);

		// Character update
		this.character.render();
		this.i++;

		setTimeout(() => {
			this.gameUpdate()
		}, config.gameTick);
	}

	updateCamera() {
		/*
		 * อัพเดตกล้อง ให้เคลื่อนที่ตามตัวละคร
		 * (Not finished / Can't used)
		 *
		 */
		this.camera.x = this.character.x - (this.camera.width / 2);
		this.camera.y = this.character.y - (this.camera.height / 2);
	}

	generateMap() {
		/*
		 * Generate map ขึ้นมาใหม่
		 *
		 */
		this.maps = []
		for (let r = 0; r < this.board.height / 20; r++) {
			let rows = []
			for (let c = 0; c < this.board.width / 20; c++) {
				rows.push(randomColor("Blue"));
			}
			this.maps.push(rows)
		}
		//console.log(this.maps)
	}

	drawMap() {
		/*
		 * วาดแผนที่ ลงไปใน canvas
		 */

		// Legacy
		this.context.save();
		this.context.fillStyle = "#1e7c3e";
		this.context.fillRect(0, 0, this.board.width, this.board.height);
		this.context.restore();
		
		/*
		for (let r = 0; r < this.board.height / 20; r++) {
			for (let c = 0; c < this.board.width / 20; c++) {
				this.context.fillStyle = this.maps[r][c];
				this.context.fillRect(c * 20, r * 20, 20, 20);		
			}
		}*/

		let tileSize = 20;
		var onXTile = Math.floor((this.camera.x + (this.camera.width / 2)) / tileSize);
		var onYTile = Math.floor((this.camera.y + (this.camera.height / 2)) / tileSize);
		
	}

	drawRotatedBox(x, y, width, height, angle) { 
		/*
		 * วาดกล่องลงไปใน canvas
		 * (Not used)
		 *
		 */
		this.context.save();
		this.context.translate(x, y);
		this.context.rotate(angle * Math.PI / 180);
		this.context.fillStyle = "red";
		this.context.fillRect(-width/2, -height/2, width, height);
		this.context.restore(); 
	}

	resizeCanvas() {
		/*
		 * ปรับ canvas size
		 *
		 */
	  	this.board.style.width = window.innerWidth + "px";
  		this.board.style.height = window.innerHeight + "px";
	  	console.log(this.board.style.width, this.board.style.height);
	};
}

function randomColor(tone="Red") {
	/*
	 * Random สี
	 */
	colorCode = "0123456789ABCDEF"
	color = "#"
	for (let i = 0; i < 3; i++) {
		if (i == 0 && tone === "Red") {
			color += "F" + colorCode[Math.floor(Math.random() * 16)]
		} else if (i == 1 && tone === "Green") {
			color += (Math.random() >= 0.5 ? "F" : "E") + colorCode[Math.floor(Math.random() * 16)]
		} else if (i == 2 && tone === "Blue") {
			color += "F" + colorCode[Math.floor(Math.random() * 16)]
		} else {
			color += colorCode[Math.max(2, Math.floor(Math.random() * 13))] + colorCode[Math.floor(Math.random() * 16)]
		}
	}
	return color
}

/* Configuration */
const config = {
	gameTick: 20
}

/* Game declare */
const game = new GameBoard("GameBoard");

//game.init();
