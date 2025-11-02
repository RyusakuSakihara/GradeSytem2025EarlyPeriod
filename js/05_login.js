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
    // リダイレクト方式でサインイン（ポップアップを避ける）
    .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    .catch((error) => {
      // Handle Errors here.
      console.error("signInWithRedirect error:", error);
    });
};

// リダイレクト結果の確認
firebase
  .auth()
  .getRedirectResult()
  .then((result) => {
    if (result && result.user) {
      console.log("Redirect sign-in successful:", result.user.email);
    }
  })
  .catch((error) => {
    console.error("getRedirectResult error:", error);
  });
