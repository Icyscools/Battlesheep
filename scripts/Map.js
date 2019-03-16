class Map {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
        this.tileSize = 10;
        this.map = {
            width: this.width,
            height: this.height,
            data: []
        };
        this.camera = {
            x: 0,
            y: 0,
            width: 854 * 0.8,
            height: 480 * 0.8
        };
        //var onXTile = Math.floor((this.camera.x + (this.camera.width / 2)) / tileSize);
        //var onYTile = Math.floor((this.camera.y + (this.camera.height / 2)) / tileSize);
        
        console.log(this.map)
        console.log(this.camera)

        this.mapCanvas = document.querySelector("#GameMap");
        this.mapCanvas.width = this.map.width;
        this.mapCanvas.height = this.map.height;
        this.mapCanvas.style.width = this.map.width;
        this.mapCanvas.style.height = this.map.height;

        this.gameCanvas = document.querySelector("#GameBoard");
        this.gameCanvas.width = this.camera.width;
        this.gameCanvas.height = this.camera.height;
        this.gameCanvas.style.width = this.map.width;
        this.gameCanvas.style.height = this.map.height;

        this.generateMap();
        this.drawMap()
    }

    getGameBoard() {
        return this.gameCanvas;
    }

    getMapCanvas() {
        return this.mapCanvas;
    }

    generateMap() {
        let element = document.querySelector("#GameMap");
        this.map.data = []
        for (let r = 0; r < this.height; r++) {
            let rows = []
            for (let c = 0; c < this.width; c++) {
                rows.push(randomColor("Green"));
            }
            this.map.data.push(rows)
        }
    }

    drawMap() {
        /*
         * วาดแผนที่ ลงไปใน canvas
         */

        // Legacy
        /*
        this.context.save();
        this.context.fillStyle = "#1e7c3e";
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
        */
       
        let canvas = document.querySelector("#GameMap");
        let context = canvas.getContext("2d");
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                context.fillStyle = this.map.data[r][c];
                context.fillRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    updateCamera() {
		/*
		 * อัพเดตกล้อง ให้เคลื่อนที่ตามตัวละคร
		 * (Not finished / Can't used)
		 *
		 */
        this.camera.x = game.character.x + game.character.width / 2 - this.camera.width / 2;
        this.camera.y = game.character.y + game.character.height / 2 - this.camera.height / 2;
        this.renderCamera();
    }

    renderCamera() {
        let gameBoard = game.getContext("2d");
        gameBoard.drawImage(this.mapCanvas, this.camera.x, this.camera.y, this.camera.width, this.camera.height, 0, 0, this.camera.width, this.camera.height);

        /*
        // Draw Rectangle around the character; Can remove this
        gameBoard.strokeStyle="blue";
        gameBoard.beginPath();
        //gameBoard.rect(this.x - (this.width / 2), this.y - (this.height / 2), this.width * 2, this.height * 2, 0);
        gameBoard.rect(this.camera.x, this.camera.y, this.camera.width, this.camera.height, 0);
        gameBoard.lineWidth=1;
        gameBoard.stroke();
        gameBoard.restore();
        */
    }
}

function randomColor(tone = "Red") {
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