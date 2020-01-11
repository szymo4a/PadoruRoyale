
class present {

constructor (posX = 1, posZ = 1) {

	this.randX  = Math.ceil(Math.random() * 2);
	this.randY  = Math.ceil(Math.random() * 2);
	this.randZ  = Math.ceil(Math.random() * 2);
	this.height = Math.ceil(Math.random()*4)+8;

	this.maxFallY = -0.9+(this.randY*0.9/2);
	this.fallingSpeed = 0.023;

	this.presentGroup = new THREE.Group();
	//let presentColor = new THREE.Color(`hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`);

	const colorArray = [
			'chocolate'
		,	'gold'
		,	'slateblue'
	];

	let randomPresentColor = Math.floor(Math.random()*colorArray.length);
	let presentColor = new THREE.Color(colorArray[randomPresentColor]);

	let colorError = 1;
	let randomStripeColor = 0;
	while (colorError) {
		colorError = 0;
		randomStripeColor = Math.floor(Math.random()*colorArray.length);
		if (randomStripeColor == randomPresentColor) {
			colorError = 1;
		}
	}
	let presentColorStripe = new THREE.Color(colorArray[randomStripeColor]);

	let presentGeometry = new THREE.BoxGeometry(0.9*this.randX, 0.9*this.randY, 0.9*this.randZ);
	let presentMaterial = new THREE.MeshStandardMaterial({
		color: presentColor
		//transparent: true,
		//opacity: 0.5
	});
	this.object = new THREE.Mesh(presentGeometry, presentMaterial);
	

	let wireframeGeo = new THREE.EdgesGeometry( presentGeometry );
	let wireframeMat = new THREE.LineBasicMaterial( { 
		color: presentColor.offsetHSL(0, 0, -0.15), 
		linewidth: 1,
		//opacity: 0.5,
		//transparent: true
		} );
	let wireframe = new THREE.LineSegments( wireframeGeo, wireframeMat );
	wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
	this.object.add( wireframe );

	this.presentGroup.add(this.object);

	/*
		//		3
		//	2	1	4
		//		5
		//		6
	*/

	let ribbonMaterial = new THREE.MeshStandardMaterial( { 
		color: presentColorStripe
		 } );
	const ribbonThickness = 0.9*0.2;

	let ribbonXGeo = new THREE.PlaneGeometry((0.9*this.randX)+0.02, ribbonThickness);
	let ribbonZGeo = new THREE.PlaneGeometry(ribbonThickness, (0.9*this.randZ)+0.02);
	let ribbonYGeo = new THREE.PlaneGeometry(ribbonThickness, (0.9*this.randY)+0.02);
	

	let ribbon124 = new THREE.Mesh( ribbonXGeo, ribbonMaterial );
	ribbon124.renderOrder = 2;
	ribbon124.rotation.x = -Math.PI / 2;
	ribbon124.position.y = (0.9*this.randY / 2)+0.01;
	this.presentGroup.add( ribbon124 );

	let ribbon135 = new THREE.Mesh( ribbonZGeo, ribbonMaterial );
	ribbon135.renderOrder = 3;
	ribbon135.rotation.x = -Math.PI / 2;
	ribbon135.position.y = (0.9*this.randY / 2)+0.01;
	this.presentGroup.add( ribbon135 );

	let ribbon624 = new THREE.Mesh( ribbonXGeo, ribbonMaterial );
	ribbon624.renderOrder = 2;
	ribbon624.rotation.x = -Math.PI / 2;
	ribbon624.rotation.y = Math.PI;
	ribbon624.position.y = -((0.9*this.randY / 2)+0.01);
	this.presentGroup.add( ribbon624 );

	let ribbon635 = new THREE.Mesh( ribbonZGeo, ribbonMaterial );
	ribbon635.renderOrder = 3;
	ribbon635.rotation.x = -Math.PI / 2;
	ribbon635.rotation.y = Math.PI;
	ribbon635.position.y = -((0.9*this.randY / 2)+0.01);
	this.presentGroup.add( ribbon635 );


	let ribbon524 = new THREE.Mesh( ribbonXGeo, ribbonMaterial );
	ribbon524.renderOrder = 2;
	ribbon524.position.z = (0.9*this.randZ / 2)+0.01;
	this.presentGroup.add( ribbon524 );

	let ribbon516 = new THREE.Mesh( ribbonYGeo, ribbonMaterial );
	ribbon516.renderOrder = 3;
	ribbon516.position.z = (0.9*this.randZ / 2)+0.01;
	this.presentGroup.add( ribbon516 );

	let ribbon324 = new THREE.Mesh( ribbonXGeo, ribbonMaterial );
	ribbon324.renderOrder = 2;
	ribbon324.rotation.y = Math.PI;
	ribbon324.position.z = -((0.9*this.randZ / 2)+0.01);
	this.presentGroup.add( ribbon324 );

	let ribbon316 = new THREE.Mesh( ribbonYGeo, ribbonMaterial );
	ribbon316.renderOrder = 3;
	ribbon316.rotation.y = Math.PI;
	ribbon316.position.z = -((0.9*this.randZ / 2)+0.01);
	this.presentGroup.add( ribbon316 );


	let ribbon235 = new THREE.Mesh( ribbonZGeo, ribbonMaterial );
	ribbon235.renderOrder = 2;
	ribbon235.rotation.x = Math.PI/2;
	ribbon235.rotation.y = -Math.PI/2;
	ribbon235.position.x = -((0.9*this.randX / 2)+0.01);
	this.presentGroup.add( ribbon235 );

	let ribbon216 = new THREE.Mesh( ribbonYGeo, ribbonMaterial );
	ribbon216.renderOrder = 2;
	ribbon216.rotation.x = Math.PI;
	ribbon216.rotation.y = -Math.PI/2;
	ribbon216.position.x = -((0.9*this.randX / 2)+0.01);
	this.presentGroup.add( ribbon216 );

	let ribbon435 = new THREE.Mesh( ribbonZGeo, ribbonMaterial );
	ribbon435.renderOrder = 2;
	ribbon435.rotation.x = Math.PI/2;
	ribbon435.rotation.y = Math.PI/2;
	ribbon435.position.x = (0.9*this.randX / 2)+0.01;
	this.presentGroup.add( ribbon435 );

	let ribbon416 = new THREE.Mesh( ribbonYGeo, ribbonMaterial );
	ribbon416.renderOrder = 2;
	ribbon416.rotation.x = Math.PI;
	ribbon416.rotation.y = Math.PI/2;
	ribbon416.position.x = (0.9*this.randX / 2)+0.01;
	this.presentGroup.add( ribbon416 );

	let knotGeometry = new THREE.TorusKnotGeometry( 0.2, 0.02, 100, 16 , 7, 8);
	let knot = new THREE.Mesh( knotGeometry, ribbonMaterial );
	knot.renderOrder = 1;
	knot.rotation.x = -Math.PI / 2;
	knot.position.y = (0.9*this.randY / 2)+0.01+0.1;
	this.presentGroup.add( knot );

	this.presentGroup.position.x = posX;
	this.presentGroup.position.z = posZ;
	this.setHeight();

}


falling() {

	if (this.presentGroup.position.y > this.maxFallY) {

		this.presentGroup.position.y -= this.fallingSpeed;
	}
}

setHeight() {
	
	this.presentGroup.position.y = this.height;
}


addToScene() {

		this.presentGroup.traverse( function( node ) {

        	if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow = true; }

    	} );
	this.presentGroup.castShadow = true;
	this.presentGroup.receiveShadow = false;
	scene.add(this.presentGroup);
}

};