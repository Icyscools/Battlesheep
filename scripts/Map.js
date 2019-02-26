class Map {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
        let tileSize = 20;
        //var onXTile = Math.floor((this.camera.x + (this.camera.width / 2)) / tileSize);
        //var onYTile = Math.floor((this.camera.y + (this.camera.height / 2)) / tileSize);

        this.generateMap();
    }

    generateMap() {
        this.maps = []
        for (let r = 0; r < this.height / 20; r++) {
            let rows = []
            for (let c = 0; c < this.width / 20; c++) {
                rows.push(randomColor("Green"));
            }
            this.maps.push(rows)
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

		for (let r = 0; r < this.height / 20; r++) {
			for (let c = 0; c < this.width / 20; c++) {
				this.context.fillStyle = this.maps[r][c];
				this.context.fillRect(c * 20, r * 20, 20, 20);
			}
		}

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