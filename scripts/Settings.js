class Settings {
	constructor() {

		this.blockSquare = 5;


                this.worldSize     = 320;
                this.worldHeight = 20;

		this.chunkSize 	 = 16;
		this.chunkSquare = this.chunkSize * this.chunkSize;
	}
}

const settings = new Settings();