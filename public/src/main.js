/* LOGIN WITH GOOGLE ACCOUNT
		-	Con var provider se crea una instancia del objeto del proveedor de Google.
		- con signInWithPopup estás pidiendo a los usuarios que accedan con su cuenta de Google a través de una ventana emergente (también se puede redireccionarlos a una página de acceso con signInWithRedirect, muy útil en móviles).
		- Con var token obtienes el token de acceso de google y así puedes acceder a Google API.
		- Con var user obtienes la información del usuario cuando hace login.
*/


function application() {
	var btnSignin;
	var btnSignout;
	var signinContainer;
	var userInfo;
	var user;

	function googleSignin() {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth()
			.signInWithPopup(provider)
			.then(function(result) {
				var token = result.credential.accessToken;
				user = result.user;
				resetLogin();
				printInfoWhenUserLogin();
				console.log('Token: ', token);
				console.log('User: ', user);

			}).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				var email = error.mail;
				var credential = error.credential;
				console.log(errorCode);
				console.log(errorMessage);
			});
	}

	function printInfoWhenUserLogin() {
		var userImage = document.querySelector('.user-image');
		var userName = document.querySelector('.user-name');
		var imageContent = '<img class="avatar" src="' + user.photoURL + '" alt="' + user.displayName + '">';
		userImage.innerHTML = imageContent;
		userName.innerHTML = user.displayName;
	}

	function googleSignout() {
		firebase.auth().signOut()
			.then(function() {
				resetLogin();
				console.log('Signout Succesfull!!');
			}, function(error) {
				console.log('Signout Failed!!');
			});
	}

	function resetLogin() {
		signinContainer.classList.toggle('hidden');
		userInfo.classList.toggle('hidden');
		btnSignout.classList.toggle('hidden');
	}

	function start() {
		signinContainer = document.querySelector('.signin-container');
		userInfo = document.querySelector('.user-info');
		btnSignin = document.querySelector('.sign-in');
		btnSignout = document.querySelector('.sign-out');
		btnSignin.addEventListener('click', googleSignin);
		btnSignout.addEventListener('click', googleSignout);
	}
	return {
		start: start
	}
}
