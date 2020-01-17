// Height and width in 16:8 ratio
	let myWidth  = window.innerWidth;
	let myHeight = window.innerHeight;
	if ((myWidth*8)/16 <= myHeight) {
		myHeight = (myWidth*8)/16;
	} else {
		myWidth = (myHeight*16)/8;
	}
//

let scene = new THREE.Scene();
let camera  = new THREE.PerspectiveCamera(75, myWidth / myHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(myWidth, myHeight);

document.body.appendChild(renderer.domElement);
renderer.setClearColor ( 'cornflowerblue', 1.0 );
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

let myAbientLight = new THREE.AmbientLight('white', 1.8);
scene.add(myAbientLight);

// some constants
	
		const floorSideX = 30;
		const floorSideZ = 20;
		const wallHeight = 4;
//

// Automatic height and width in 16:8 ratio
	const resize = () => {
		requestAnimationFrame(resize);
			myWidth  = window.innerWidth;
			myHeight = window.innerHeight;
			if ((myWidth*8)/16 <= myHeight) {
				myHeight = (myWidth*8)/16;
			} else {
				myWidth = (myHeight*16)/8;
			}
		renderer.setSize(myWidth, myHeight);
		renderer.render(scene, camera);
	}
	resize();
//

// Some  variables
	let Padoru1;
	let Padoru2;
	let creeper1;
	let creeper2;
	let snow_golem1;
	let snow_golem2;
	let snow_golem3;
	let sterText;
//


const main = (player1, player2) => {


	// some variables

		let maxPresents = ((floorSideX-2)/2)*((floorSideZ-2)/2) * (1/3);
		let currentPresents = 0;

		let gameStatus = 1;
		let animateStatus = 1;
	//

	// Camera and players position

		camera.position.y = 16;
		camera.position.z = 8.6;
		camera.position.x = 0;

		camera.lookAt(0, 0, 0);

		player1.Group.position.x = -floorSideX/4;
		player1.Group.position.y = 0;
		player1.Group.position.z = 0;

		player2.Group.position.x =  floorSideX/4;
		player2.Group.position.y = 0;
		player2.Group.position.z = 0;
	//

	// Interface update (HP etc.)

		document.querySelector("#info1").style.visibility = "visible";
		document.querySelector("#info2").style.visibility = "visible";

		let oldHPTab = [-1, -1];
		let oldATab  = [-1, -1];

		const updateInterface = (_player) => {


			let playertab = [player1, player2];

			if (playertab[_player].hearts != oldHPTab[_player]) {

				for (let i = 0; i < playertab[_player].hearts; i++) {
					document.querySelector(`#P${_player+1}HP${i+1}`).style.visibility = "visible";
				}
				for (let i = playertab[_player].hearts; i < 5; i++) {
					document.querySelector(`#P${_player+1}HP${i+1}`).style.visibility = "hidden";
				}
				oldHPTab[_player] = playertab[_player].hearts;
			}

			if (playertab[_player].ammunition != oldATab[_player]) {

				for (let i = 0; i < playertab[_player].ammunition; i++) {
					document.querySelector(`#P${_player+1}A${i+1}`).style.visibility = "visible";
				}
				for (let i = playertab[_player].ammunition; i < 5; i++) {
					document.querySelector(`#P${_player+1}A${i+1}`).style.visibility = "hidden";
				}
				oldATab[_player] = playertab[_player].ammunition;
			}

			// speedboosttank
			// 224px - 100%
			// 10px  - 0%
			//
			// boostFuel: 0-30

			let newFuelAmount = playertab[_player].boostFuel/30;
			document.querySelector(`#playerInfoBoost${_player+1}`).style.width = `${newFuelAmount * 224}px`;
		}
		updateInterface(0);
		updateInterface(1);
	//

	// Snowballs!
		player1Snowballs = [];
		player2Snowballs = [];

		const snowball = (plr) => {
			if (plr == 1) {
				player1Snowballs.push(new Snowball(1));
				player1Snowballs[player1Snowballs.length-1].position(player1.Group.position.x, player1.Group.position.y, player1.Group.position.z);
				player1Snowballs[player1Snowballs.length-1].target(player2.Group.position.x, player2.Group.position.y, player2.Group.position.z);
				player1Snowballs[player1Snowballs.length-1].addToScene();
				player1.ammunition--;
				updateInterface(0);
			} else {
				player2Snowballs.push(new Snowball(2));
				player2Snowballs[player2Snowballs.length-1].position(player2.Group.position.x, player2.Group.position.y, player2.Group.position.z);
				player2Snowballs[player2Snowballs.length-1].target(player1.Group.position.x, player1.Group.position.y, player1.Group.position.z);
				player2Snowballs[player2Snowballs.length-1].addToScene();
				player2.ammunition--;
				updateInterface(1);
			}
		}

		setInterval(function(){ 	// Refill ammo

			if (player1.ammunition < 5) {
				player1.ammunition++;
			}
			if (player2.ammunition < 5) {
				player2.ammunition++;
			}
			if (player1.ammunition > 5) {
				player1.ammunition = 5;
			}
			if (player2.ammunition > 5) {
				player2.ammunition = 5;
			}
			updateInterface(0);
			updateInterface(1);
		 }, 1100);
	//

	// Controls

		//https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

		player1.setKeys(
				"E".charCodeAt(0)
			,	"D".charCodeAt(0)
			,	"S".charCodeAt(0)
			,	"F".charCodeAt(0)
			,	16	// Shift		// Boost
			,	"J".charCodeAt(0)	// Jump
			,	"H".charCodeAt(0)	// Snowball
			)

		player2.setKeys(
				38	// ArrUp
			,	40	// ArrDown
			,	37	// ArrLeft
			,	39	// ArrRight
			,	17	// Ctrl			// Boost
			,	99	// num 3		// Jump
			,	98	// num 2		// Snowball
			)

		const starting = () => {    
		    if (event.keyCode == player1.moveUp) {
		        player1.movement[1] = -1;
		    }
		    if (event.keyCode == player1.moveDown) {
		        player1.movement[1] = 1;
		    }
		    if (event.keyCode == player1.moveLeft) {
		        player1.movement[0] = -1;
		    }
		    if (event.keyCode == player1.moveRight) {
		        player1.movement[0] = 1;
		    }
		    if (event.keyCode == player1.boostKey) {
		        player1.isBoostPressed = true;
		    }
		    if (event.keyCode == player1.jumpKey && !player1.alreadyJumping) {
		        player1.jump();
		    }
		    if (event.keyCode == player1.snowballKey && player1.ammunition > 0) {
		        snowball(1);
		    }



		    if (event.keyCode == player2.moveUp) {
		        player2.movement[1] = -1;
		    }
		    if (event.keyCode == player2.moveDown) {
		        player2.movement[1] = 1;
		    }
		    if (event.keyCode == player2.moveLeft) {
		        player2.movement[0] = -1;
		    }
		    if (event.keyCode == player2.moveRight) {
		        player2.movement[0] = 1;
		    }
		    if (event.keyCode == player2.boostKey) {
		        player2.isBoostPressed = true;
		    }
		    if (event.keyCode == player2.jumpKey && !player2.alreadyJumping) {
		        player2.jump();
		    }
		    if (event.keyCode == player2.snowballKey && player2.ammunition > 0) {
		        snowball(2);
		    }
		}

		const stopping = () => {    
	    	if (event.keyCode == player1.moveUp && player1.movement[1] != 1) {
		        player1.movement[1] = 0;
		    }
		    if (event.keyCode == player1.moveDown && player1.movement[1] != -1) {
		        player1.movement[1] = 0;
		    }
		    if (event.keyCode == player1.moveLeft && player1.movement[0] != 1) {
		        player1.movement[0] = 0;
		    }
		    if (event.keyCode == player1.moveRight && player1.movement[0] != -1) {
		        player1.movement[0] = 0;
		    }
		    if (event.keyCode == player1.boostKey) {
		        player1.isBoostPressed = false;
		    }

		    if (event.keyCode == player2.moveUp && player2.movement[1] != 1) {
		        player2.movement[1] = 0;
		    }
		    if (event.keyCode == player2.moveDown && player2.movement[1] != -1) {
		        player2.movement[1] = 0;
		    }
		    if (event.keyCode == player2.moveLeft && player2.movement[0] != 1) {
		        player2.movement[0] = 0;
		    }
		    if (event.keyCode == player2.moveRight && player2.movement[0] != -1) {
		        player2.movement[0] = 0;
		    }
		    if (event.keyCode == player2.boostKey) {
		        player2.isBoostPressed = false;
		    }
		}

		document.addEventListener("keydown", starting);
		document.addEventListener("keyup", stopping);

		setInterval(function(){ player1.boostManagement(); updateInterface(0);}, 200);
		setInterval(function(){ player2.boostManagement(); updateInterface(1);}, 200);
	//

	// Scene
		// Floor
			let floorGeometry = new THREE.PlaneGeometry(floorSideX,floorSideZ);
			let floorMaterial = new THREE.MeshStandardMaterial({
				//color: 'snow',
				roughness: 1,
				metalness: 0.6,
				map: snowFloorTexture.texture
			});
			let floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
			floorPlane.receiveShadow = true;
			floorPlane.castShadow = false;
			scene.add(floorPlane);
			floorPlane.rotation.x = -Math.PI / 2;
			floorPlane.position.y = -0.9;
		//

		// Walls
			// N
				let wallNGeometry = new THREE.PlaneGeometry(floorSideX,wallHeight);
				let wallNMaterial = new THREE.MeshStandardMaterial({
					//color: 'snow', 
					//opacity: 0.4,
					//transparent: true,
					map: wallXTexture.texture
				});
				let wallNPlane = new THREE.Mesh(wallNGeometry, wallNMaterial);
				wallNPlane.receiveShadow = false;
				wallNPlane.castShadow = true;
				scene.add(wallNPlane);
				wallNPlane.position.y = (wallHeight/2)-0.9;
				wallNPlane.position.z = -floorSideZ/2;
			//
			// S
				let wallSGeometry = new THREE.PlaneGeometry(floorSideX,wallHeight);
				let wallSMaterial = new THREE.MeshStandardMaterial({
					//color: 'snow', 
					//opacity: 0.4,
					//transparent: true
					map: wallXTexture.texture
				});
				let wallSPlane = new THREE.Mesh(wallSGeometry, wallSMaterial);
				wallSPlane.receiveShadow = true;
				wallSPlane.castShadow = false;
				scene.add(wallSPlane);
				wallSPlane.rotation.y = Math.PI;
				wallSPlane.position.y = (wallHeight/2)-0.9;
				wallSPlane.position.z = floorSideZ/2;
			//
			// E
				let wallEGeometry = new THREE.PlaneGeometry(floorSideZ,wallHeight);
				let wallEMaterial = new THREE.MeshStandardMaterial({
					//color: 'snow', 
					//opacity: 0.4, 
					//transparent: true
					map: wallZTexture.texture
				});
				let wallEPlane = new THREE.Mesh(wallEGeometry, wallEMaterial);
				wallEPlane.receiveShadow = false;
				wallEPlane.castShadow = true;
				scene.add(wallEPlane);
				wallEPlane.rotation.y = -Math.PI/2;
				wallEPlane.position.y = (wallHeight/2)-0.9;
				wallEPlane.position.x = floorSideX/2;
			//
			// W
				let wallWGeometry = new THREE.PlaneGeometry(floorSideZ,wallHeight);
				let wallWMaterial = new THREE.MeshStandardMaterial({
					//color: 'snow', 
					//opacity: 0.4,
					//transparent: true
					map: wallZTexture.texture
				});
				let wallWPlane = new THREE.Mesh(wallWGeometry, wallWMaterial);
				wallWPlane.receiveShadow = true;
				wallWPlane.castShadow = false;
				scene.add(wallWPlane);
				wallWPlane.rotation.y = Math.PI/2;
				wallWPlane.position.y = (wallHeight/2)-0.9;
				wallWPlane.position.x = -floorSideX/2;
			//
		//

		// Top 

			// N
				let floorTGeometryX = new THREE.PlaneGeometry(floorSideX*3,floorSideZ*3);
				let floorTMaterialX = new THREE.MeshStandardMaterial({
					
					roughness: 1,
					metalness: 0.6,
					map: snowTopXTexture.texture
				});
				let floorTPlaneX = new THREE.Mesh(floorTGeometryX, floorTMaterialX);
				floorTPlaneX.receiveShadow = true;
				floorTPlaneX.castShadow = false;
				scene.add(floorTPlaneX);
				floorTPlaneX.rotation.x = -Math.PI / 2;
				floorTPlaneX.position.y = wallHeight-0.9;
				floorTPlaneX.position.z = -(floorSideZ/2 + floorSideZ*3/2);
			//

			// S
				let floorTPlaneX2 = new THREE.Mesh(floorTGeometryX, floorTMaterialX);
				floorTPlaneX2.receiveShadow = true;
				floorTPlaneX2.castShadow = false;
				scene.add(floorTPlaneX2);
				floorTPlaneX2.rotation.x = -Math.PI / 2;
				floorTPlaneX2.position.y = wallHeight-0.9;
				floorTPlaneX2.position.z = floorSideZ/2 + floorSideZ*3/2;
			//

			// W
				let floorTGeometryZ = new THREE.PlaneGeometry(floorSideX*1,floorSideZ*1);
				let floorTMaterialZ = new THREE.MeshStandardMaterial({
					
					roughness: 1,
					metalness: 0.6,
					map: snowTopZTexture.texture
				});
				let floorTPlaneZ = new THREE.Mesh(floorTGeometryZ, floorTMaterialZ);
				floorTPlaneZ.receiveShadow = true;
				floorTPlaneZ.castShadow = false;
				scene.add(floorTPlaneZ);
				floorTPlaneZ.rotation.x = -Math.PI / 2;
				floorTPlaneZ.position.y = wallHeight-0.9;
				floorTPlaneZ.position.x = -floorSideX;
			//

			// E
				let floorTPlaneZ2 = new THREE.Mesh(floorTGeometryZ, floorTMaterialZ);
				floorTPlaneZ2.receiveShadow = true;
				floorTPlaneZ2.castShadow = false;
				scene.add(floorTPlaneZ2);
				floorTPlaneZ2.rotation.x = -Math.PI / 2;
				floorTPlaneZ2.position.y = wallHeight-0.9;
				floorTPlaneZ2.position.x = floorSideX;
			//
		//

		// Scenery

			let directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
			directionalLight.position.z = -floorSideZ*3;
			directionalLight.intensity = 0.6;
			directionalLight.position.y = 40;
			directionalLight.position.x = floorSideX;
			directionalLight.castShadow = true;
			directionalLight.shadowCameraLeft = -floorSideZ;
			directionalLight.shadowCameraRight = floorSideZ;
			directionalLight.shadowCameraTop = floorSideX;
			directionalLight.shadowCameraBottom = -floorSideX;
			scene.add( directionalLight );

			/*
			     1  3     7 8
			                  9
	           2              10
							  
			  6                11
	           4              12
	            5
			*/

			let newTree1 = new tree();
			newTree1.position(-floorSideX/2 +1, -0.9+wallHeight, -floorSideZ/2 -1);
			newTree1.addToScene();

			let newTree2 = new tree();
			newTree2.position(-floorSideX/2 -1, -0.9+wallHeight, -1);
			newTree2.addToScene();

			let newTree3 = new tree();
			newTree3.position(-2, -0.9+wallHeight, -floorSideZ/2 -1);
			newTree3.addToScene();

			let newTree4 = new tree();
			newTree4.position(-floorSideX/2 -1, -0.9+wallHeight, floorSideZ/2 -1);
			newTree4.addToScene();

			let newTree5 = new tree();
			newTree5.position(-floorSideX/2 +3, -0.9+wallHeight, floorSideZ/2 +1);
			newTree5.addToScene();

			let newTree6 = new tree();
			newTree6.position(-floorSideX/2 -3, -0.9+wallHeight, floorSideZ/2 -3);
			newTree6.addToScene();

			let newTree7 = new tree();
			newTree7.position(floorSideX/2 -5, -0.9+wallHeight, -floorSideZ/2 -1);
			newTree7.addToScene();

			let newTree8 = new tree();
			newTree8.position(floorSideX/2 -1, -0.9+wallHeight, -floorSideZ/2 -1);
			newTree8.addToScene();

			let newTree9 = new tree();
			newTree9.position(floorSideX/2 +1, -0.9+wallHeight, -floorSideZ/2 +1);
			newTree9.addToScene();

			let newTree10 = new tree();
			newTree10.position(floorSideX/2 +1, -0.9+wallHeight, -floorSideZ/2 +5);
			newTree10.addToScene();

			let newTree11 = new tree();
			newTree11.position(floorSideX/2 +3, -0.9+wallHeight, -floorSideZ/2 +11);
			newTree11.addToScene();

			let newTree12 = new tree();
			newTree12.position(floorSideX/2 +1, -0.9+wallHeight, -floorSideZ/2 +15);
			newTree12.addToScene();

			creeper1.Group.position.x = floorSideX/2 +2.5;
			creeper1.Group.position.y = wallHeight;
			creeper1.Group.position.z = -floorSideZ/2 +2;
			creeper1.Group.rotation.y = 2*Math.PI/8 * 6.8;
			creeper1.addToScene();

			creeper2.Group.position.x = floorSideX/2 +3.5;
			creeper2.Group.position.y = wallHeight;
			creeper2.Group.position.z = -floorSideZ/2 +13;
			creeper2.Group.rotation.y = 2*Math.PI/8 * 5.5;
			creeper2.addToScene();

			snow_golem1.Group.position.x = 4;
			snow_golem1.Group.position.y = wallHeight;
			snow_golem1.Group.position.z = -floorSideZ/2 -1;
			snow_golem1.Group.rotation.y = 2*Math.PI/8 * 1;
			snow_golem1.addToScene();

			snow_golem2.Group.position.x = -4.5;
			snow_golem2.Group.position.y = wallHeight;
			snow_golem2.Group.position.z = -floorSideZ/2 -1.5;
			snow_golem2.addToScene();

			snow_golem3.Group.position.x = -floorSideX/2 -0.7;
			snow_golem3.Group.position.y = wallHeight;
			snow_golem3.Group.position.z = 2;
			snow_golem3.Group.rotation.y = 2*Math.PI/8 * 2;
			snow_golem3.addToScene();

		//
	//

	// Presents

		let presentsTab = [];
		currentPresents = 0;
	 setTimeout(function() {
		setInterval(function(){ 
			if (currentPresents < maxPresents && animateStatus) {
			let presentChance = 0;

				       if (currentPresents <  (maxPresents/3)) {

					presentChance = Math.floor((Math.random()*3)/2);

				} else if (currentPresents <  (maxPresents/2)) {

					presentChance = Math.floor(Math.random()*2);

				} else  if (currentPresents <  (2 * maxPresents/3)){

					presentChance = Math.floor(Math.random()*5);

				} else {
					presentChance = Math.floor(Math.random()*10);
				}
				if(!presentChance) {

					let placementError = 0;
					let playertab = [player1, player2];
					let randomplayer = Math.floor(Math.random()*2);	// First, try to spawn present on top of a player
					let randXPos = playertab[randomplayer].Group.position.x;
	    			let randZPos = playertab[randomplayer].Group.position.z;
	    			for (let i = 0; i < maxPresents; i++) {
							if (typeof(presentsTab[i]) != 'undefined') {

	    							if (Math.abs(randXPos - presentsTab[i].presentGroup.position.x) < (0.45 * presentsTab[i].randX + 0.95) && 
	    								Math.abs(randZPos - presentsTab[i].presentGroup.position.z) < (0.45 * presentsTab[i].randZ + 0.95)) {
	    								placementError = 1;
	    							}
	    					}
						}
					while (placementError) {	// If not, find a free spot
						placementError = 0;
	    				randXPos = Math.floor(Math.random()*(floorSideX-2)) - (floorSideX-2)/2;
	    				randZPos = Math.floor(Math.random()*(floorSideZ-2)) - (floorSideZ-2)/2;

						for (let i = 0; i < maxPresents; i++) {
							if (typeof(presentsTab[i]) != 'undefined') {

	    							if (Math.abs(randXPos - presentsTab[i].presentGroup.position.x) < (0.45 * presentsTab[i].randX + 1) && 
	    								Math.abs(randZPos - presentsTab[i].presentGroup.position.z) < (0.45 * presentsTab[i].randZ + 1)) {
	    								placementError = 1;
	    								break;
	    							}
	    					}
						}
					}

					presentsTab.push(new present(randXPos, randZPos));
					++currentPresents;

					presentsTab[presentsTab.length-1].addToScene();

				}
			}
	 }, 1000);}, 3000);
	//

	// Collisions 
	
		const borderCollision = (player) => {

			if (-((floorSideX-1.8)/2) > player.Group.position.x) {
				player.Group.position.x = -((floorSideX-1.8)/2);
			} else if (((floorSideX-1.8)/2) < player.Group.position.x) {
				player.Group.position.x = ((floorSideX-1.8)/2);
			}

			if (-((floorSideZ-1.8)/2) > player.Group.position.z) {
				player.Group.position.z = -((floorSideZ-1.8)/2);
			} else if (((floorSideZ-1.8)/2) < player.Group.position.z) {
				player.Group.position.z = ((floorSideZ-1.8)/2);
			}
		}

		const snowballCollision = (sn, player) => {

			if (-((floorSideX)/2) > sn.object.position.x) {
				return true;
			} else if (((floorSideX)/2) < sn.object.position.x) {
				return true;
			}

			if (-((floorSideZ)/2) > sn.object.position.z) {
				return true;
			} else if (((floorSideZ)/2) < sn.object.position.z) {
				return true;
			}

			if (-0.9 > sn.object.position.y) {
				return true;
			}


			let distanceX = Math.abs(player.Group.position.x - sn.object.position.x);
			let distanceY = Math.abs(player.Group.position.y - sn.object.position.y);
			let distanceZ = Math.abs(player.Group.position.z - sn.object.position.z);

			if (!player.shield && distanceY < 0.9 && distanceX < 0.4 && distanceZ < 0.4) {
				console.log(`Collision snowball: player ${player.id}`);
				player.takeDamage();

				updateInterface(player.id);

				return true;
			}
			return false;
		}

		const presentCollision = (player, present) => {

			let distanceX = Math.abs(player.Group.position.x - present.presentGroup.position.x);
			let distanceY = Math.abs(player.Group.position.y - present.presentGroup.position.y);
			let distanceZ = Math.abs(player.Group.position.z - present.presentGroup.position.z);

			let minDistanceX = 0.4 + (present.randX * 0.45);
			let minDistanceY = 0.9 + (present.randY * 0.45);
			let minDistanceZ = 0.4 + (present.randZ * 0.45);

			if (!player.shield && distanceY < minDistanceY && distanceX < minDistanceX && distanceZ < minDistanceZ) {
				console.log(`Collision: player ${player.id}`);
				player.takeDamage();

				updateInterface(player.id);

				present.presentGroup.position.x = floorSideX;
				present.presentGroup.position.y = -5;
				present.presentGroup.position.z = floorSideZ;
				scene.remove(present.presentGroup);
				maxPresents++;
			}
		}

		const playerCollision = (_player1, _player2) => {	//I know it's not perfect, but it'll do for now
			if (Math.abs(_player1.Group.position.x - _player2.Group.position.x) < 0.8
		     && Math.abs(_player1.Group.position.y - _player2.Group.position.y) < 1.8
			 && Math.abs(_player1.Group.position.z - _player2.Group.position.z) < 0.8) {

				let p1Total1 = _player1.totalSpeed[0];
				let p1Total2 = _player1.totalSpeed[1];
				let p2Total1 = _player2.totalSpeed[0];
				let p2Total2 = _player2.totalSpeed[1];

				if(!_player1.addSpH && !_player2.addSpH) {
					_player1.additionalSpeed[0] = p2Total1*1.01 - p1Total1*1.5;
					_player1.additionalSpeed[1] = p2Total2*1.01 - p1Total2*1.5;

					_player2.additionalSpeed[0] = p1Total1*1.01 - p2Total1*1.5;
					_player2.additionalSpeed[1] = p1Total2*1.01 - p2Total2*1.5;

					_player1.addSpH = true;
					_player2.addSpH = true;
					setTimeout(function() {
						_player1.addSpH = false;
						_player2.addSpH = false;
					}, 300);
				}

			}
		}
	//

	// Game over handlers
		const checkForWin = (_player1, _player2) => {

			if (_player1.hearts <= 0 || _player2.hearts <= 0) {

				gameOver();
			}
		}


		const gameOver = () => {

			if (gameStatus) {
				gameStatus = 0;
				console.log('rip');
			}
		}

		let specialPresentsTab = [];
		const gameOverScreen = () => {	// Game over scenery screen


			document.querySelector("#info1").style.visibility = "hidden";
			document.querySelector("#info2").style.visibility = "hidden";

		 	document.querySelector("#info1").style.display = "none";
			document.querySelector("#info2").style.display = "none";

			scene.remove( directionalLight );
			renderer.setClearColor ( 0x070B34, 1.0 );
			let myAbientLight2 = new THREE.AmbientLight('white', 0.8);
			scene.remove(myAbientLight);
			scene.add(myAbientLight2);

			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = 5;
			camera.lookAt(0, 0, 0);
			camera.position.x = floorSideX*4;
			camera.position.z = 5;

			let snowMaterial = new THREE.MeshStandardMaterial({
				color: 'snow',
				roughness: 1,
				emissive: 0x424242,
				metalness: 0.6
			});

			let WfloorPlane = new THREE.Mesh(new THREE.PlaneGeometry(80,40), snowMaterial);
			scene.add(WfloorPlane);
			WfloorPlane.rotation.x = -Math.PI / 2;
			WfloorPlane.position.y = -0.9;
			WfloorPlane.position.x = floorSideX*4;
			WfloorPlane.receiveShadow = true;
			WfloorPlane.castShadow = false;

			player1.Group.position.x = 0;
			player1.Group.position.y = 0;
			player1.Group.position.z = 0;
			player1.Group.rotation.x = 0;
			player1.Group.rotation.y = 0;
			player1.Group.rotation.z = 0;
			player1.Group.position.x = floorSideX*4;

			player2.Group.position.x = 0;
			player2.Group.position.y = 0;
			player2.Group.position.z = 0;
			player2.Group.rotation.x = 0;
			player2.Group.rotation.y = 0;
			player2.Group.rotation.z = 0;
			player2.Group.position.x = floorSideX*4;

			let snowHill1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 15, 15), snowMaterial);
			scene.add(snowHill1);
			snowHill1.position.x = floorSideX*4;
			snowHill1.castShadow = true;
			snowHill1.receiveShadow = true;
			snowHill1.position.x += 3;
			snowHill1.position.z += -1;
			snowHill1.position.y += -0.9;

			let snowHill2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 15, 15), snowMaterial);
			scene.add(snowHill2);
			snowHill2.position.x = floorSideX*4;
			snowHill2.castShadow = true;
			snowHill2.receiveShadow = true;
			snowHill2.position.x += -1;
			snowHill2.position.z += 1;
			snowHill2.position.y += -1.9;

			let snowHill3 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 15, 15), snowMaterial);
			scene.add(snowHill3);
			snowHill3.position.x = floorSideX*4;
			snowHill3.castShadow = true;
			snowHill3.receiveShadow = true;
			snowHill3.position.x += -2;
			snowHill3.position.z += 1;
			snowHill3.position.y += -2.1;

			let snowHill4 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 15, 15), snowMaterial);
			scene.add(snowHill4);
			snowHill4.position.x = floorSideX*4;
			snowHill4.castShadow = true;
			snowHill4.receiveShadow = true;
			snowHill4.position.x += -2;
			snowHill4.position.z += -4;
			snowHill4.position.y += -1.2;

			let lantern1 = new lantern();
			lantern1.addToScene();
			lantern1.position(floorSideX*4 + 5, -0.9, -1.1);

			specialPresentsTab[0] = new present(floorSideX*4 + 4, 1.5);
			specialPresentsTab[0].addToScene();

			let tree1 = new tree();
			tree1.addToScene();
			tree1.position(floorSideX*4 -4, -0.9, -2);

			let lantern2 = new lantern();
			lantern2.addToScene();
			lantern2.position(floorSideX*4 -6.5, -0.9, -2.4);

			specialPresentsTab[1] = new present(floorSideX*4 +0.5, -2.2);
			specialPresentsTab[1].addToScene();

			specialPresentsTab[2] = new present(floorSideX*4 -5, 0.5);
			specialPresentsTab[2].addToScene();

			let winner;
			let loser;
			if (player1.hearts < player2.hearts) {
	    		winner = player2;
	    		loser  = player1;
	    	} else {
	    		winner = player1;
	    		loser  = player2;
	    	}
			winner.Group.position.x += 3;
			winner.Group.position.z += -1;
			winner.Group.position.y +=  1.5;
			winner.Group.rotation.y += -Math.PI / 8;

			loser.Group.rotation.z = Math.PI / 4;
			loser.Group.rotation.x = Math.PI / 2;
	    	loser.Group.position.y += -0.6;
	    	loser.Group.position.x += -0.5;

	    	document.querySelector("#restartButton").style.visibility = "visible";
		}

		const changeLight = (timeC) => {
			
			const ambientStep = myAbientLight.intensity/timeC;
			const directionalStep = directionalLight.intensity/timeC;

			let newA = myAbientLight.intensity;
			let newD = directionalLight.intensity;

			let currTime = 0;

			let lightInterval = setInterval(function() {

				newA -= ambientStep;
				newD -= directionalStep;

				currTime += 1;

				if (typeof myAbientLight != 'undefined') {
					//console.log(myAbientLight.intensity);

					myAbientLight.intensity = newA;
					directionalLight.intensity = newD;
				}

				if(currTime >= timeC) {

				if (typeof myAbientLight != 'undefined') {
					
					myAbientLight.intensity = 0;
					directionalLight.intensity = 0;
				}
					clearInterval(lightInterval);
				}

			}, 1);

		}
	//

	// Animate
		let animateTimeoutHelper = 1;
		const animate = () => {

	    		if (!gameStatus && animateStatus && animateTimeoutHelper) {
	    			animateTimeoutHelper = 0;

	    			if (player1.hearts < player2.hearts) {
	    				player1.Group.rotation.x = Math.PI / 2;
	    				player1.Group.position.y = -0.4;
	    			} else {
	    				player2.Group.rotation.x = Math.PI / 2;
	    				player2.Group.position.y = -0.4;
	    			}

	    			changeLight(3000);

	    			setTimeout(function(){ 

	    				animateStatus = 0;
	    				gameOverScreen();
	    			 }, 4000);
	    		}

	    		if (animateStatus) {

		    		checkForWin(player1, player2);

		    		if (animateTimeoutHelper) {
		    			playerCollision(player1, player2);
			    		player1.move();
			    		borderCollision(player1);
			    		player2.move();
			    		borderCollision(player2);

					for(let i = 0; i < player1Snowballs.length; i++) {

						if (typeof player1Snowballs[i] != "undefined") {

			    			player1Snowballs[i].goToTarget();
			    			if (snowballCollision(player1Snowballs[i], player2)) {
			    				player1Snowballs[i].position(-100, -100, -100);
			    				scene.remove(player1Snowballs[i]);
			    				player1Snowballs[i] = undefined;
			    			}
						}
		    		}
					for(let i = 0; i < player2Snowballs.length; i++) {

						if (typeof player2Snowballs[i] != "undefined") {

			    			player2Snowballs[i].goToTarget();
			    			if (snowballCollision(player2Snowballs[i], player1)) {
			    				player2Snowballs[i].position(-100, -100, -100);
			    				scene.remove(player2Snowballs[i]);
			    				player2Snowballs[i] = undefined;
			    			}
						}
		    		}

		    		for(let i = 0; i < maxPresents; i++) {
		    			if (typeof(presentsTab[i]) != 'undefined') {

		    				presentsTab[i].falling();

		    				if (animateTimeoutHelper) {
			    				presentCollision(player1, presentsTab[i]);
			    				presentCollision(player2, presentsTab[i]);
			    			}
		    			}
		    		}

		    		}
	    		} else {

		    		specialPresentsTab[0].falling();
		    		specialPresentsTab[0].falling();
		    		specialPresentsTab[1].falling();
		    		specialPresentsTab[2].falling();
		    		specialPresentsTab[2].falling();
		    		specialPresentsTab[2].falling();
	    		}
	    	setTimeout(animate, 1000/110);
		}
		setTimeout(animate, 3200);
	//
	
	// Initial countdown (prevents initial lag)
		    document.querySelector("#timerText").style.visibility = "visible";
		setTimeout(function(){
			document.querySelector("#timerText").innerHTML = "2";
		}, 1000);
		setTimeout(function(){
			document.querySelector("#timerText").innerHTML = "1";
		}, 2000);
		setTimeout(function(){
			document.querySelector("#timerText").style.visibility = "hidden";
		}, 3000);
	//
}


// 'Menu', will be updated in the future
	let enterErr = false;
	const menuFunc = () => {
		let infoScreenGeo = new THREE.PlaneGeometry(8, 6);
		let infoScreenMat = new THREE.MeshBasicMaterial({				
			map: sterText.texture
		});
		let infoScreen = new THREE.Mesh(infoScreenGeo, infoScreenMat);
		infoScreen.position.y = -100;
		infoScreen.position.z = -12;
		scene.add(infoScreen);
		camera.position.y = -98;
		camera.position.z = -5;

		Padoru1.addToScene();
		Padoru1.Group.position.x = -2.5;
		Padoru1.Group.position.y = -96;
		Padoru1.Group.position.z = -12;
		Padoru2.addToScene();
		Padoru2.Group.position.x =  2.5;
		Padoru2.Group.position.y = -96;
		Padoru2.Group.position.z = -12;

		const doIStartNow = () => {
			if (event.keyCode == 13 && !enterErr) {		// ENTER
			        console.log(`Game is starting!`);
			        enterErr = true;
					scene.remove(infoScreen);
			        main(Padoru1, Padoru2);
			        return;
			    }
		}
		document.addEventListener("keydown", doIStartNow);
		renderer.render(scene, camera);
	}
//


// Resources
	Padoru1 = new padoru(0, 'padoruRed');
	Padoru1.loadObject();

	Padoru2 = new padoru(1, 'padoruGreen');
	Padoru2.loadObject();

	creeper1 = new creeper();
	creeper1.loadObject();

	creeper2 = new creeper();
	creeper2.loadObject();

	snow_golem1 = new snow_golem();
	snow_golem1.loadObject();

	snow_golem2 = new snow_golem();
	snow_golem2.loadObject();

	snow_golem3 = new snow_golem();
	snow_golem3.loadObject();

	let snowFloorTexture = new MyTexture(`snow.jpg`,  floorSideX/2, floorSideZ/2);
	let wallXTexture     = new MyTexture(`stone.jpg`, floorSideX/2, wallHeight/2);
	let wallZTexture     = new MyTexture(`stone.jpg`, floorSideZ/2, wallHeight/2);


	let snowTopXTexture = new MyTexture(`snow.jpg`, floorSideX*3/2, floorSideZ*3/2);
	let snowTopZTexture = new MyTexture(`snow.jpg`, floorSideX/2,   floorSideZ/2);

	sterText = new MyTexture(`sterowanie.png`, 1, 1);

	{
			let numOfObjLoaded = 0;

			let totalToLoad = 13;

			let loadTab = [];
			for (let i = 0; i < totalToLoad; i++) {
				loadTab[i] = false;
			}

				let wallGeometry = new THREE.PlaneGeometry(20,20);
				let wallMaterial = new THREE.MeshStandardMaterial({
					color: 'snow'
				});
				let wallPlane = new THREE.Mesh(wallGeometry, wallMaterial);
				scene.add(wallPlane);
				wallPlane.position.y = -100;
				wallPlane.position.z = -1;

				let loadingGeometry = new THREE.SphereGeometry(0.1, 10, 10);
				let loadingMaterial = new THREE.MeshStandardMaterial({
					color: 0x171d22,
					roughness: 1,
					emissive: 0x101010,
					metalness: 0.6
				});

				let loadingGroup = new THREE.Group();
				let loading1sphereG = new THREE.Group();
				let loading2sphereG = new THREE.Group();
				let loading3sphereG = new THREE.Group();
				let loading4sphereG = new THREE.Group();
				let loading5sphereG = new THREE.Group();

				let loading1sphere = new THREE.Mesh(loadingGeometry, loadingMaterial);
				loading1sphere.position.x = 1;
				loading1sphereG.add(loading1sphere);

				let loading2sphere = new THREE.Mesh(loadingGeometry, loadingMaterial);
				loading2sphere.position.x = -1;
				loading2sphereG.add(loading2sphere);

				let loading3sphere = new THREE.Mesh(loadingGeometry, loadingMaterial);
				loading3sphere.position.y = 1;
				loading3sphereG.add(loading3sphere);

				let loading4sphere = new THREE.Mesh(loadingGeometry, loadingMaterial);
				loading4sphere.position.y = -1;
				loading4sphereG.add(loading4sphere);

				loadingGroup.add(loading1sphereG);
				loadingGroup.add(loading2sphereG);
				loadingGroup.add(loading3sphereG);
				loadingGroup.add(loading4sphereG);
				loadingGroup.position.y = -100;
				loadingGroup.position.z = -0.95;
				scene.add(loadingGroup);

			const updateLoadingText = () => {
				let loadingText = document.querySelector("#loadingText");
				loadingText.innerHTML = `${numOfObjLoaded} / ${totalToLoad}`;
			}

			const loadingScreen = () => {

				camera.position.y = -100;
				camera.position.z = 4;

				loading1sphereG.rotation.z += 0.013;
				loading2sphereG.rotation.z += 0.013;
				loading3sphereG.rotation.z += 0.013;
				loading4sphereG.rotation.z += 0.013;	

				updateLoadingText();		

				renderer.render(scene, camera);
			}

			const checkIfLoaded = () => {


				if (!loadTab[0] && Padoru1.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 1/${totalToLoad}!`);
					loadTab[0] = true;
			    }
			    if (!loadTab[1] && Padoru2.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 2/${totalToLoad}!`);
					loadTab[1] = true;
			    }

			    if (!loadTab[2] && snowFloorTexture.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 3/${totalToLoad}!`);
					loadTab[2] = true;
			    }

			    if (!loadTab[3] && wallXTexture.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 4/${totalToLoad}!`);
					loadTab[3] = true;
			    }
			    if (!loadTab[4] && wallZTexture.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 5/${totalToLoad}!`);
					loadTab[4] = true;
			    }

			    if (!loadTab[5] && snowTopXTexture.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 6/${totalToLoad}!`);
					loadTab[5] = true;
			    }
			    if (!loadTab[6] && snowTopZTexture.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 7/${totalToLoad}!`);
					loadTab[6] = true;
			    }
			    if (!loadTab[7] && creeper1.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 8/${totalToLoad}!`);
					loadTab[7] = true;
			    }
			    if (!loadTab[8] && creeper2.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 9/${totalToLoad}!`);
					loadTab[8] = true;
			    }
			    if (!loadTab[9] && snow_golem1.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 10/${totalToLoad}!`);
					loadTab[9] = true;
			    }
			    if (!loadTab[10] && snow_golem2.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 11/${totalToLoad}!`);
					loadTab[10] = true;
			    }
			    if (!loadTab[11] && snow_golem3.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 12/${totalToLoad}!`);
					loadTab[11] = true;
			    }
			    if (!loadTab[12] && sterText.loaded)
			    {
					++numOfObjLoaded;
					console.log(`Loaded resource 13/${totalToLoad}!`);
					loadTab[12] = true;
			    }

			    if (numOfObjLoaded == totalToLoad) {

					document.querySelector("#loadingText").style.display = "none";
					
					scene.remove(loadingGroup);
					menuFunc();
					
					return;
			    }

				setTimeout(checkIfLoaded, 1);
				console.log("Loading...");
				loadingScreen();

			}
			checkIfLoaded();
 }
//

// no ctrl+anything for you (except for browser shortcuts (like ctrl+w in chrome) while not in fullscreen mode)
	window.addEventListener("keydown",function (e) {
	    if (e.ctrlKey && !(e.ctrlKey && e.keyCode === 116)) { 	// 116 - F5
	        e.preventDefault();
	    }
	});
	window.onbeforeunload = function (e) {
	    if (e.ctrlKey && !(e.ctrlKey && e.keyCode === 116)) { 	// 116 - F5
	        e.preventDefault();
	    e.returnValue = 'Really want to quit the game?';
	    }
	};
//