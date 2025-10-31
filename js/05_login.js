firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;

    //ログインが確認出来たら
    console.log(user);
    //   User_Data_Display(user)
  } else {
    //ログインが確認できなかったら
    console.log(user);

    Sign_In_google();
  }
});

const Sign_In_google = () => {
  // var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().languageCode = "ja";
  firebase
    .auth()
    // .signInWithRedirect(provider)
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(errorMessage);
    });
};
