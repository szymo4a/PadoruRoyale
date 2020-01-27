//
//  Created by Szymon Krawczyk 2019
//

class MyTexture {

constructor (url_, X_, Z_) {

	this.url = url_;
	this.loaded = false;

	this.X = X_;
	this.Z = Z_;


	let _this = this;  //Because 'this' is not visible

	this.texture = new THREE.TextureLoader().load(
		`textures/${_this.url}`,

		// onLoad callback
		function ( texture ) {
			_this.loaded = true;
			_this.texture.wrapS = THREE.RepeatWrapping;
			_this.texture.wrapT = THREE.RepeatWrapping;
			_this.texture.repeat.set( _this.X, _this.Z );
		},

		// onProgress callback currently not supported
		undefined,

		// onError callback
		function ( err ) {
			console.error( 'An error happened.' );
		}
	);
}

};