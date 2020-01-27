//
//  Created by Szymon Krawczyk 2019
//

class Snowball {

constructor (id) {


	this.id = id;
	this.speed = 0.15;

	let material;
	if (this.id == 1) {
		material = new THREE.MeshStandardMaterial( { 
			color: 0xff5858,
			roughness: 1,
			emissive: 0x101010,
			metalness: 0.6
		} );
	} else {
		material = new THREE.MeshStandardMaterial( { 
			color: 0x58ff58,
			roughness: 1,
			emissive: 0x101010,
			metalness: 0.6
		} );
	}

	this.object = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), material);
	this.object.receiveShadow = true;
	this.object.castShadow = true;
}

position(x, y, z) {
	this.object.position.x = x;
	this.object.position.y = y;
	this.object.position.z = z;
}

target(x, y, z) {	// Calculate vector to target
	this.targetX = x;
	this.targetY = y;
	this.targetZ = z;

	this.dirX = this.targetX - this.object.position.x;
	this.dirY = this.targetY - this.object.position.y;
	this.dirZ = this.targetZ - this.object.position.z;

	this.targetVL = Math.sqrt(this.dirX * this.dirX + this.dirY * this.dirY + this.dirZ * this.dirZ);
	this.dirVX = this.dirX / this.targetVL;
	this.dirVY = this.dirY / this.targetVL;
	this.dirVZ = this.dirZ / this.targetVL;
}

goToTarget() {
	this.object.position.x += this.dirVX * this.speed;
	this.object.position.y += this.dirVY * this.speed;
	this.object.position.z += this.dirVZ * this.speed;
}

addToScene() {
	scene.add(this.object);
}

};