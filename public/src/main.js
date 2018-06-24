/* LOGIN WITH GOOGLE ACCOUNT
		-	Con var provider se crea una instancia del objeto del proveedor de Google.
		- con signInWithPopup estás pidiendo a los usuarios que accedan con su cuenta de Google a través de una ventana emergente (también se puede redireccionarlos a una página de acceso con signInWithRedirect, muy útil en móviles).
		- Con var token obtienes el token de acceso de google y así puedes acceder a Google API.
		- Con var user obtienes la información del usuario cuando hace login.
*/


function application() {
	var btnSave;
	var btnSignin;
	var btnSignout;
	var signinContainer;
	var provider;
	var userInfo;
	var user;
	var welcome;


	function googleSignin() {
		firebase.auth()
			.signInWithPopup(provider)
			.then(function(result) {
				var token = result.credential.accessToken;
				console.log('Token: ', token);
				// user = result.user;
				// console.log('User: ', user);

			}).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				var email = error.mail;
				var credential = error.credential;
				console.log(errorCode);
				console.log(errorMessage);
			});
	}

	function subscribeAuthStateChanged(onLogIn, onLogOut) {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log('El usuario está logueado');
				console.log('User: ', user);
				onLogIn(user);
			} else {
				console.log('El usuario no está logueado');
				onLogOut(user);
			}
		});
	}

	function renderInfoWhenUserLogin(user) {
		var userImage = document.querySelector('.user-image');
		var userName = document.querySelector('.user-name');
		var imageContent = '<img class="avatar" src="' + user.photoURL + '" alt="' + user.displayName + '">';
		userImage.innerHTML = imageContent;
		userName.innerHTML = user.displayName;
	}

	function onLogIn(user) {
		createButtonSignOut();
		createInfoUserContainer();
		renderInfoWhenUserLogin(user);
		createWelcome();
		saveDataUsersByLoginInBbdd(user);
	}

	function onLogOut(user) {
		removeButtonSignOut();
		removeInfoUserContainer();
		removeWelcome();
	}

	function createButtonSignOut() {
		btnSignout.classList.remove('hidden');
		signinContainer.classList.add('hidden');
	}

	function removeButtonSignOut() {
		btnSignout.classList.add('hidden');
		signinContainer.classList.remove('hidden');
	}

	function createInfoUserContainer() {
		userInfo.classList.remove('hidden');
	}

	function removeInfoUserContainer() {
		userInfo.classList.add('hidden');
	}

	function createWelcome() {
		welcome.classList.remove('hidden');
	}

	function removeWelcome() {
		welcome.classList.add('hidden');
	}

	function googleSignout() {
		firebase.auth().signOut()
			.then(function() {
				console.log('Signout Succesfull!!');
			}, function(error) {
				console.log('Signout Failed!!');
			});
	}

	function saveDataUsersByLoginInBbdd(userLogin) {
		var userApp = {
			uid: userLogin.uid,
			username: userLogin.displayName,
			email: userLogin.email,
			profile_picture: userLogin.photoURL
		}
		firebase.database().ref('users/'+ userLogin.uid)
			.set(userApp);

		console.log("Usuario guardado", userLogin);
	}

	function saveGamesBbdd() {

	}


	function start() {
		provider = new firebase.auth.GoogleAuthProvider();
		signinContainer = document.querySelector('.signin-container');
		userInfo = document.querySelector('.user-info');
		btnSave = document.querySelector('.save');
		btnSignin = document.querySelector('.sign-in');
		btnSignout = document.querySelector('.sign-out');
		welcome = document.querySelector('.welcome');
		subscribeAuthStateChanged(onLogIn, onLogOut);
		btnSignin.addEventListener('click', googleSignin);
		btnSignout.addEventListener('click', googleSignout);
		btnSave.addEventListener('click', saveGamesBbdd);
	}

	return {
		start: start
	}
}

window.onload = function() {
	application().start();
};
