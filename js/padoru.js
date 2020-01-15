
class padoru {

constructor (id, modelSrc) {

	this.id 			= id;
	this.scale 			= 1;
	this.modelSrc 		= modelSrc;
	this.padoruModel;
	this.loaded 		= false;

	this.movement 		= [0, 0];
	this.totalSpeed 	= [0, 0];
	this.additionalSpeed= [0, 0];
	this.speed 			= 0.1;
	this.isBoostPressed = false;
	this.boost 			= 1;
	this.boostFuel  	= 30;
	this.lookingAt 		= 0;
	this.currentHeight  = 0;
	this.jumpHeight 	= 2;

	this.hearts 		= 5;
	this.shield 		= false;

	this.ammunition 	= 0;

	this.Group = new THREE.Group();

	this.loadShield();

}

setKeys(up, down, left, right, boost, jump, snowball) {

	this.moveUp 		= up;
	this.moveDown 		= down;
	this.moveLeft 		= left;
	this.moveRight 		= right;
	this.boostKey 		= boost;
	this.jumpKey 		= jump;
	this.snowballKey	= snowball;
}

loadObject() {

	let loader = new THREE.GLTFLoader();
	let tempModel;
	let tempLoaded;
	let tempScale = this.scale;
	loader.load( `objects/padoru/${this.modelSrc}.glb`, function ( gltf ) {

		//console.log(gltf.scene.children[0]);
	    tempModel = gltf.scene.children[0];
	    tempModel.name = 'PadoruBody';
	    tempModel.scale.set (tempScale, tempScale, tempScale);
	    tempModel.position.set ( 0, -0.9, 0 );
	    tempModel.castShadow = true;
		tempLoaded = true;
		
		gltf.scene.traverse( function( node ) {

        	if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow = true; }

    	} );

		tempSet();

	}, undefined, function ( error ) {

		console.error( error );

	} );

	const tempSet = () => {
		this.loaded = tempLoaded;
		//console.log(tempModel);
		this.padoruModel = tempModel;
		//this.addToScene();
		this.Group.add(this.padoruModel);
	}
	
}

loadShield() {

	this.shieldCylinder = new THREE.Mesh(

		new THREE.CylinderGeometry( 1, 1, 2.3, 20 ), 
		new THREE.MeshStandardMaterial({
			color: 'blue', 
			opacity: 0.15, 
			transparent: true
		}))
	this.Group.add(this.shieldCylinder);
	this.toggleShield();
}

toggleShield() {
	if (!this.shieldCylinder.visible) {
		this.shieldCylinder.visible = true;
	} else {
		this.shieldCylinder.visible = false;
	}
}

shieldAnimation() {
	let _this = this;
						   _this.shieldCylinder.visible = false;
	setTimeout(function(){ _this.shieldCylinder.visible = true;  },  250);
	setTimeout(function(){ _this.shieldCylinder.visible = false; },  500);
	setTimeout(function(){ _this.shieldCylinder.visible = true;  },  750);
	setTimeout(function(){ _this.shieldCylinder.visible = false; }, 1000);
	setTimeout(function(){ _this.shieldCylinder.visible = true;  }, 1250);
}


move() {

	if (this.movement[0] && this.movement[1]) {
		this.currentSpeed = this.speed * 0.7;
	} else {
		this.currentSpeed = this.speed;
	}

	this.addSpH = false;
	if(this.additionalSpeed[0] > 0.005) {
		this.additionalSpeed[0] += -0.005;
	} else if (this.additionalSpeed[0] < -0.005) {
		this.additionalSpeed[0] += 0.005;
	}	else {
		this.additionalSpeed[0] = 0;
	}

	if(this.additionalSpeed[1] > 0.005) {
		this.additionalSpeed[1] += -0.005;
	} else if (this.additionalSpeed[1] < -0.005) {
		this.additionalSpeed[1] += 0.005;
	}	else {
		this.additionalSpeed[1] = 0;
	}

	this.totalSpeed[0] = this.movement[0] * this.currentSpeed * this.boost + this.additionalSpeed[0];
	this.totalSpeed[1] = this.movement[1] * this.currentSpeed * this.boost + this.additionalSpeed[1];
	this.Group.position.x += this.totalSpeed[0];
	this.Group.position.z += this.totalSpeed[1];

	this.adjustLooking();

	if(this.alreadyJumping) {
		this.adjustJumping();
	}
}

adjustLooking() {

	/*
		// E  = 2 	//  1,  0
		// NE = 3	//  1, -1
		// N  = 4	//  0, -1
		// NW = 5	// -1, -1
		// W  = 6	// -1,  0
		// SW = 7	// -1,  1
		// S  = 0	//  0,  1
		// SE = 1	//  1,  1
	*/

	if (this.movement[0] == 1 && this.movement[1] == 0) {
		this.lookingAt = 2;
	} 
	else if (this.movement[0] == 1 && this.movement[1] == -1) {
		this.lookingAt = 3;
	}
	else if (this.movement[0] == 0 && this.movement[1] == -1) {
		this.lookingAt = 4;
	}
	else if (this.movement[0] == -1 && this.movement[1] == -1) {
		this.lookingAt = 5;
	}
	else if (this.movement[0] == -1 && this.movement[1] == 0) {
		this.lookingAt = 6;
	}
	else if (this.movement[0] == -1 && this.movement[1] == 1) {
		this.lookingAt = 7;
	}
	else if (this.movement[0] == 0 && this.movement[1] == 1) {
		this.lookingAt = 0;
	}
	else if (this.movement[0] == 1 && this.movement[1] == 1) {
		this.lookingAt = 1;
	}

	//console.log(this.lookingAt);
	this.Group.rotation.y = 2*Math.PI/8 * this.lookingAt;
}


adjustJumping() {
	this.Group.position.y = this.currentHeight;
}

jump() {
	this.alreadyJumping = true;

	let up = true;
	let y = 0;
	let _this = this;
	let jumpInterval = setInterval(function(){ 

		if (_this.currentHeight < _this.jumpHeight && up) {		

			y = Math.abs(_this.jumpHeight-_this.currentHeight)*0.04 + 0.01;
			_this.currentHeight += y;

		} 

		if (_this.currentHeight >= _this.jumpHeight) {
			up = false;
		}

		if (_this.currentHeight > 0 && !up) {	

			y = Math.abs(_this.jumpHeight-_this.currentHeight)*0.04 + 0.01;
			_this.currentHeight -= y;

		}

		if (_this.currentHeight <= 0) {

			_this.alreadyJumping = false;

			_this.currentHeight = 0;
			_this.adjustJumping();

			clearInterval(jumpInterval);
		}

	}, 1);

}

boostManagement() {

	//console.log(`Player boost: ${this.boost}, fuel: ${this.boostFuel}`);
	if (this.isBoostPressed && (this.totalSpeed[0] || this.totalSpeed[1])) {

		if (this.boostFuel > 0) {

			this.boostFuel -= 3;
			this.boost = 2;
		} else {

			this.boostFuel = 0;
			this.boost = 1;
		}
	} 
	else {

		if (this.boostFuel < 30) {

			this.boostFuel += 1;
			this.boost = 1;
		}
	}
}

takeDamage() {

	if(!this.shield) {

		this.shield = true;
		this.hearts--;
		this.toggleShield();

		this.damageAnimation();


		let _this = this;
		
		setTimeout(function(){ 

			_this.shieldAnimation();

		}, 1500);
		setTimeout(function(){ 

			_this.shield = false;
			_this.toggleShield();

		}, 3000);		
	}
}

damageAnimation() {
	let _this = this;
						   _this.padoruModel.visible = false;
	setTimeout(function(){ _this.padoruModel.visible = true;  },  50);
	setTimeout(function(){ _this.padoruModel.visible = false; }, 100);
	setTimeout(function(){ _this.padoruModel.visible = true;  }, 150);
	setTimeout(function(){ _this.padoruModel.visible = false; }, 200);
	setTimeout(function(){ _this.padoruModel.visible = true;  }, 250);
	setTimeout(function(){ _this.padoruModel.visible = false; }, 300);
	setTimeout(function(){ _this.padoruModel.visible = true;  }, 350);
	setTimeout(function(){ _this.padoruModel.visible = false; }, 375);
	setTimeout(function(){ _this.padoruModel.visible = true;  }, 400);
}

addToScene() {

	scene.add(this.Group);
}

};