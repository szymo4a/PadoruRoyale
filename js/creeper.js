
class creeper {

constructor () {

	this.scale 			= 0.1;
	this.Model;
	this.loaded 		= false;

	this.Group = new THREE.Group();

}


loadObject() {

	let loader = new THREE.GLTFLoader();
	let tempModel;
	let tempLoaded;
	let tempScale = this.scale;
	loader.load( `objects/mc/creeper/creeper.glb`, function ( gltf ) {

		//console.log(gltf.scene.children[0]);
	    tempModel = gltf.scene.children[0];
	    tempModel.name = 'CreeperBody';
	    tempModel.scale.set (tempScale, tempScale, tempScale);
	    tempModel.position.set ( 0, 0.4, 0 );
	    tempModel.castShadow = true;
		tempLoaded = true;
		
		gltf.scene.traverse( function( node ) {

        	if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow = false; }

    	} );

		tempSet();

	}, undefined, function ( error ) {

		console.error( error );

	} );

	const tempSet = () => {
		this.loaded = tempLoaded;
		//console.log(tempModel);
		this.Model = tempModel;
		//this.addToScene();
		this.Group.add(this.Model);
	}
	
}

//this.Group.rotation.y = 2*Math.PI/8 * this.lookingAt;

addToScene() {

	scene.add(this.Group);
}

};