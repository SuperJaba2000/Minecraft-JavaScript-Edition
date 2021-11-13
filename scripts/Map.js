class Block{
	geometry = null;
	
	constructor(x, y, z, color){
		this.geometry = new BoxGeometry(settings.blockSquare, settings.blockSquare*2, settings.blockSquare);
		
		this.object = new Mesh(
		        this.geometry,
			new MeshBasicMaterial({ color: color })
		);
		this.object.position.set(x * settings.blockSquare, y * settings.blockSquare, z * settings.blockSquare);
	}
}

class Tiles3D{
	
	constructor(size, height){
		
		this.tiles = Array(size).fill().map(
		        () => Array(height).fill().map(
				() => Array(size).fill(null)
			)
		)
		
		this.size = size;
		this.height = height;
	}
	
	get(x, y, z){
	        return this.tiles[x][y][z];	
	}
	
	set(block, x, y, z){
		this.tiles[x][y][z] = block;
	}
}

class Chunk{
	
	offSetX = 0; 
	offSetZ = 0;
	
	constructor(x, z){
		this.offSetX = x * settings.chunkSize;
		this.offSetZ = z * settings.chunkSize;
			
	        this.tiles = new Tiles3D(settings.chunkSize, settings.worldHeight);
	}
	
	generate(){
		//y
			for(let x = 0; x < settings.chunkSize; x++) {
			        for(let z = 0; z < settings.chunkSize; z++) {

                                        var value = noise.octaveSimplex2( (x + this.offSetX), (z + this.offSetZ), 25, [0.07, 0.2, 0.42, 1, 2]) * 5;
					let y = Math.floor(value)+5;
								
				        if(value <= -0.2){
						this.tiles.set(new Block(x + this.offSetX, y, z + this.offSetZ, 0x0000FF), x, y, z);
					}else if(value <= 1){
						this.tiles.set(new Block(x + this.offSetX, y, z + this.offSetZ, 0xFFFF00), x, y, z);
					}else if(value <= 3.3){
					        this.tiles.set(new Block(x + this.offSetX, y, z + this.offSetZ, 0x58FF00), x, y, z);
					}else if(value <= 4.4){
						this.tiles.set(new Block(x + this.offSetX, y, z + this.offSetZ, 0x656565), x, y, z);
					}else{
						this.tiles.set(new Block(x + this.offSetX, y, z + this.offSetZ, 0xFFFFFF), x, y, z);
					}
					
	                        }
		        }
		//y
	}
	
}

class Map{
	
        chunks = [
		[new Chunk(2, 2), new Chunk(2, 3), new Chunk(2, 4)],
		
		[new Chunk(3, 2), new Chunk(3, 3), new Chunk(3, 4)],
		
		[new Chunk(4, 2), new Chunk(4, 3), new Chunk(4, 4)],
	];
	
        constructor(seed){
	        this.SEED = seed;
        }
	
        generate(){	
                noise.seed(this.SEED);
		
                for(let x = 0; x < this.chunks.length; x++){
			for(let z = 0; z < this.chunks.length; z++){		
				this.chunks[x][z].generate();
			}
		}
	}
	
	rebuild(){

                this.cashTiles = new Tiles3D( settings.worldSize, settings.worldHeight );
		this.tiles  = new Tiles3D( settings.worldSize, settings.worldHeight );
				
		for(var chunkX = 0; chunkX < this.chunks.length; chunkX++){
			for(var chunkZ = 0; chunkZ < this.chunks[0].length; chunkZ++){
				  
				var chunk = this.chunks[chunkX][chunkZ];
						
				for(var tileX = 0; tileX < settings.chunkSize; tileX++){
                                        for(var tileY = 0; tileY < settings.worldHeight; tileY++){
                                                for(var tileZ = 0; tileZ < settings.chunkSize; tileZ++){
                                                         
                                                        var tile = chunk.tiles.get(tileX, tileY, tileZ);
							this.tiles.set( tile, tileX + chunk.offSetX, tileY, tileZ + chunk.offSetZ );							
																 
					        }
					}
				}
					
			}
		}

	}
	
	update(player, scene){
		var absoluteX = Math.floor(player.position.x / settings.blockSquare);
		var absoluteZ = Math.floor(player.position.z / settings.blockSquare);
		
		var chunkX = Math.floor(absoluteX % settings.chunkSquare);
		var chunkZ = Math.floor(absoluteZ % settings.chunkSquare);
		
		var _chunkX = Math.floor(absoluteX / settings.chunkSize);
		var _chunkZ = Math.floor(absoluteZ / settings.chunkSize);
		
	        if( 
			absoluteX > this.chunks[2][2].offSetX ||
			absoluteX < this.chunks[1][1].offSetX ||
			
			absoluteZ > this.chunks[2][2].offSetZ ||
			absoluteZ < this.chunks[1][1].offSetZ
		){
			this.chunks = [
                                [new Chunk(_chunkX-1, _chunkZ-1), new Chunk(_chunkX-1, _chunkZ), new Chunk(_chunkX-1, _chunkZ+1)],
								
				[new Chunk(_chunkX, _chunkZ-1), new Chunk(_chunkX, _chunkZ), new Chunk(_chunkX, _chunkZ+1)],
				
				[new Chunk(_chunkX+1, _chunkZ-1), new Chunk(_chunkX+1, _chunkZ), new Chunk(_chunkX+1, _chunkZ+1)],
                        ];

                        this.clear(scene);

                        this.generate();
		        this.rebuild();
			this.cashAll();	
		        this.build(scene);				
		}
	}
	
	cashAll(){
		for(var x = 0; x < this.tiles.size; x++){
			for(var y = 0; y < this.tiles.height; y++){
			        for(var z = 0; z < this.tiles.size; z++){
						
					let tile = this.tiles.get(x, y, z); 
					
					//this.addCash(x, y, z);
					this.cashTiles.set( tile, x, y, z );
		                }
		        }
		}
	}
	
	clear(scene){
		
		this.cashTiles = undefined;
		this.tiles = undefined;
		
		this.cashTiles = new Tiles3D( settings.worldSize, settings.worldHeight );
		this.tiles  = new Tiles3D( settings.worldSize, settings.worldHeight );
		
		while(scene.children.length > 0){ 
                        scene.remove(scene.children[0]); 
                }
	}
	
	build(scene){
		
		for(var x = 0; x < this.cashTiles.size; x++){
			for(var y = 0; y < this.cashTiles.height; y++){
			        for(var z = 0; z < this.cashTiles.size; z++){
						
					let tile = this.cashTiles.get(x, y, z); 
					
					if(tile !== null) scene.add(tile.object);
		                }
		        }
		}
	}
	
	addCash(x, y, z){
		
		if(
		        x == 0 ||x == this.tiles.size ||
		        z == 0 ||z == this.tiles.size ||
			y == 0 ||y == this.tiles.height
		){
			this.cashTiles.set( this.tiles.get(x, y, z), x, y, z );
		}else{
		
		        if(
		                this.tiles.get(x+1, y, z) !== null &&
		                this.tiles.get(x-1, y, z) !== null &&
		        	this.tiles.get(x, y+1, z) !== null &&
		        	this.tiles.get(x, y, z+1) !== null &&
		        	this.tiles.get(x, y, z-1) !== null
		        ){
		                this.cashTiles.set(null, x, y, z);
	                }else{
		        	this.cashTiles.set( this.tiles.get(x, y, z), x, y, z );
		        }
		}
		
	}
	
}
