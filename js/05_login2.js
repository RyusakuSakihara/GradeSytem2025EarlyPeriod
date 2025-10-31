// ログインしていなかったら---------------------------------
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    input_userName(user.email.match(/.*@/));
    // console.log(user.email);
  } else {
    //ログインが確認できなかったら
    const result = window.confirm("ログインしますか。");
    if (result) {
      Sign_In_google();
    }
  }
});

// サインインをリダイレクトで-----------------------------------------------------------
const Sign_In_google = async () => {
  var useCred = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()); //ポップアップで
  // await firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  // var userCred = await firebase.auth().getRedirectResult();
  // console.log(userCred);
};

// ログアウト----------------------------------------------
document.getElementById("logout").addEventListener("click", () => {
  Sign_In_google();
});

const input_userName = (userName) => {
  document.getElementById("logout").innerText = userName;
};
//--------------------------------------
//<a href="#" id="logout">logout</a>
