class Map{
	
    tiles = [];
	
    constructor(seed){
	this.materialArray = [];
	   
	this.SEED = seed;
		
	this.xoff = 0;
	this.zoff = 0;
	this.yoff = 0;
        this.inc = 0.05;
    }
	
    generate(scene){
        noise.seed(Math.random());
		
		for(let x = 0; x < settings.chunkSize; x++) {
			for(let z = 0; z < settings.chunkSize; z++) {
			    for(let y = 0; y < settings.worldHeight; y++) {

				let cube = new Mesh(geometry, materialArray);
				

				this.xoff = this.inc * x;
				this.zoff = this.inc * z;
				this.yoff = this.inc * y;
				    
				let value = noise.simplex3(this.xoff, this.yoff, this.zoff);

			if(value >= 0.5){
			    cube.position.set(x * settings.blockSquare, y * settings.blockSquare, z * settings.blockSquare);
			    scene.add(cube);
			}
	            }
		}
	    }
	}
	
	rebuild(opt = false){
		const settings = new Settings();

		const loader = new TextureLoader();
		const materialArray = ["dirt-side.jpg", "dirt-side.jpg", "dirt-top.jpg", "dirt-bottom.jpg", "dirt-side.jpg", "dirt-side.jpg"].map(v => {
			let texture = loader.load(`../texture/${v}`);
			texture.magFilter = NearestFilter;
			texture.minFilter = NearestFilter;
			return new MeshBasicMaterial({ map: texture });
		})

		this.materialArray = materialArray;

		const geometry = new BoxGeometry(settings.blockSquare, settings.blockSquare, settings.blockSquare);
	}
}
