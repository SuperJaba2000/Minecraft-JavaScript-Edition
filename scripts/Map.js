const loader = new TextureLoader();
const dirtMaterials = ["dirt-side.jpg", "dirt-side.jpg", "dirt-top.jpg", "dirt-bottom.jpg", "dirt-side.jpg", "dirt-side.jpg"].map(v => {
	let texture = loader.load(`../texture/${v}`);
	
	texture.magFilter = NearestFilter;
	texture.minFilter = NearestFilter;
	
	return new MeshBasicMaterial({ map: texture });
});

class Block{
	geometry = null;
	
	constructor(x, y, z){
		this.geometry = new BoxGeometry(settings.blockSquare, settings.blockSquare, settings.blockSquare);
		
		this.object = new Mesh(this.geometry, dirtMaterials);
		this.object.position.set(x * settings.blockSquare, y * settings.blockSquare, z * settings.blockSquare);
	}
}

class Chunk{
	
	x = 0; 
	z = 0;
	
	constructor(x, z){
		this.x = x;
		this.z = z;
	}
	
	generate(scene){
                const tiles = Array(settings.worldHeight).fill().map(()=> Array(settings.chunkSize).fill().map(()=> Array(settings.chunkSize).fill()));;
				
		for(let y = 0; y < settings.worldHeight; y++) {
			for(let x = 0; x < settings.chunkSize; x++) {
			        for(let z = 0; z < settings.chunkSize; z++) {

                                        let value = noise.simplex2(x / 10, z / 10);
								
				        /*if(y <= value)*/ scene.add(new Block(x + this.x, Math.floor(value), z + this.z).object);
	                        }
		        }
	        }
		
		this.tiles = tiles;
	}
	
	tiles = [];
}

class Map{
	
        chunks = [new Chunk(0, 0)];
	
        constructor(seed){
	        this.materialArray = [];
	   
	        this.SEED = seed;
        }
	
        generate(scene){	
                noise.seed(this.SEED);
		
                this.chunks[0].generate(scene);
	}
	
	/*rebuild(opt = false){


		this.materialArray = materialArray;

		const geometry = new BoxGeometry(settings.blockSquare, settings.blockSquare, settings.blockSquare);
	}*/
}
