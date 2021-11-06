class Block{
	geometry = null;
	
	constructor(x, y, z, color){
		this.geometry = new BoxGeometry(settings.blockSquare, settings.blockSquare * 2, settings.blockSquare);
		
		this.object = new Mesh(
		        this.geometry,
			new MeshBasicMaterial({ color: color })
		);
		this.object.position.set(x * settings.blockSquare, y * settings.blockSquare, z * settings.blockSquare);
	}
}

class Chunk{
	
	offSetX = 0; 
	offSetZ = 0;
	
	constructor(x, z){
		this.offSetX = x * settings.chunkSize;
		this.offSetZ = z * settings.chunkSize;
	}
	
	generate(scene){
                const tiles = Array(settings.worldHeight).fill().map(()=> Array(settings.chunkSize).fill().map(()=> Array(settings.chunkSize).fill()));;
				
		//for(let y = 0; y < settings.worldHeight; y++) {
			for(let x = 0; x < settings.chunkSize; x++) {
			        for(let z = 0; z < settings.chunkSize; z++) {

                                        let value = noise.simplex2((x + this.offSetX)/15, (z + this.offSetZ)/15) * 5;
								
				        if(value <= -0.2){
						scene.add(new Block(x + this.offSetX, -1, z + this.offSetZ, 0x0000FF).object);
					}else if(value <= 1){
						scene.add(new Block(x + this.offSetX, Math.floor(value), z + this.offSetZ, 0xFFFF00).object);
					}else if(value <= 3.3){
					        scene.add(new Block(x + this.offSetX, Math.floor(value), z + this.offSetZ, 0x00FF00).object);
					}else if(value <= 4.4){
						scene.add(new Block(x + this.offSetX, Math.floor(value), z + this.offSetZ, 0x656565).object);
					}else{
						scene.add(new Block(x + this.offSetX, Math.floor(value), z + this.offSetZ, 0xFFFFFF).object);
					}
					
	                        }
		        }
	        //}
		
		this.tiles = tiles;
	}
	
	tiles = [];
}

class Map{
	
        chunks = [
		[new Chunk(0, 0), new Chunk(0, 1), new Chunk(0, 2), new Chunk(0, 3)],
		[new Chunk(1, 0), new Chunk(1, 1), new Chunk(1, 2), new Chunk(1, 3)],
		[new Chunk(2, 0), new Chunk(2, 1), new Chunk(2, 2), new Chunk(2, 3)],
		[new Chunk(3, 0), new Chunk(3, 1), new Chunk(3, 2), new Chunk(3, 3)],
	];
	
        constructor(seed){
	        this.materialArray = [];
	   
	        this.SEED = seed;
        }
	
        generate(scene){	
                noise.seed(this.SEED);
		
                for(let x = 0; x < this.chunks.length; x++){
			for(let z = 0; z < this.chunks.length; z++){		
				this.chunks[x][z].generate(scene);
			}
		}
	}
	
	/*rebuild(opt = false){


		this.materialArray = materialArray;

		const geometry = new BoxGeometry(settings.blockSquare, settings.blockSquare, settings.blockSquare);
	}*/
}
