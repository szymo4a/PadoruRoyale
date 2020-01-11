
class lantern {

constructor () {

	this.Group = new THREE.Group();

	let mainMaterial = new THREE.MeshStandardMaterial( { 
		color: 0x212121,
		metalness: 0.8,
		roughness: 0.5
	} );

	let yellowMaterial  = new THREE.MeshStandardMaterial({
		color: 0xfce059,
		emissive: 0xfce059,
		transparent: true,
		opacity: 0.8
	});

	let base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 4, 10), mainMaterial);
	base.position.y = 2;
	base.receiveShadow = true;
	base.castShadow = true;
	this.Group.add(base);

	let yellowTop = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.1, 0.5, 20), yellowMaterial);
	yellowTop.position.y = 4.25;
	this.Group.add(yellowTop);

	let yellowTopLight = new THREE.PointLight( 0xfce059, 0.3, 30, 2);
	yellowTopLight.position.y = 4.25;
	this.Group.add(yellowTopLight);

	let endTop = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 20), mainMaterial);
	endTop.position.y = 4.55;
	this.Group.add(endTop);

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