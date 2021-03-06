function application() {
	var btnSave;
	var btnSignin;
	var btnSignout;
	var signinContainer;
	var provider;
	var userInfo;
	var user;

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

	}

	function onLogOut(user) {
		removeButtonSignOut();
		removeInfoUserContainer();
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

	function googleSignout() {
		firebase.auth().signOut()
			.then(function() {
				console.log('Signout Succesfull!!');
			}, function(error) {
				console.log('Signout Failed!!');
			});
	}

	function saveDataUsersByLoginInBbdd() {

		firebase.auth().onAuthStateChanged(function(user) {
			console.log("Usuario guardado", user);
			//Si existe el usuario
				if (user) {
					firebase.database().ref('users/'+user.uid )
						.set({
							uid: user.uid,
							username: user.displayName,
							email: user.email,
							profile_picture: user.photoURL
						});
				}
		});




	}

	function start() {
		provider = new firebase.auth.GoogleAuthProvider();
		signinContainer = document.querySelector('.signin-container');
		userInfo = document.querySelector('.user-info');
		btnSignin = document.querySelector('.sign-in');
		btnSignout = document.querySelector('.sign-out');
		btnSave = document.querySelector('.save');
		subscribeAuthStateChanged(onLogIn, onLogOut);
		btnSignin.addEventListener('click', googleSignin);
		btnSignout.addEventListener('click', googleSignout);
		btnSave.addEventListener('click', saveDataUsersByLoginInBbdd);
	}

	return {
		start: start
	}
}

window.onload = function() {
	application().start();
};
