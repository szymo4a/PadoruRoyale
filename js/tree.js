
class tree {

constructor () {

	this.Group = new THREE.Group();

	let trunkMaterial = new THREE.MeshStandardMaterial( { 
		color: 0x331f1a,
		metalness: 0,
		roughness: 1
	} );

	let leavesMaterial  = new THREE.MeshStandardMaterial({
		color: 0x2c4808,
		emissive: 0x000000,
		metalness: 0.2,
		roughness: 0.6
	});

	let trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 3, 20), trunkMaterial);
	trunk.position.y = 1.5;
	trunk.receiveShadow = false;
	trunk.castShadow = true;
	this.Group.add(trunk);

	let leavesBot = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 20), leavesMaterial);
	leavesBot.position.y = 2;
	leavesBot.receiveShadow = false;
	leavesBot.castShadow = true;
	this.Group.add(leavesBot);

	let leavesMid = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.5, 20), leavesMaterial);
	leavesMid.position.y = 2.75;
	leavesMid.receiveShadow = false;
	leavesMid.castShadow = true;
	this.Group.add(leavesMid);

	let leavesTop = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1, 20), leavesMaterial);
	leavesTop.position.y = 3.5;
	leavesTop.receiveShadow = false;
	leavesTop.castShadow = true;
	this.Group.add(leavesTop);

}

position(x, y, z) {
	this.Group.position.x = x;
	this.Group.position.y = y;
	this.Group.position.z = z;
}
addToScene() {
	scene.add(this.Group);
}

};