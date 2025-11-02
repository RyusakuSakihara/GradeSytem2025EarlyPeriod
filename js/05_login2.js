// ログインしていなかったら---------------------------------
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    // 表示用にメールアドレスの@より前を取り出す
    const name = user.email ? user.email.split("@")[0] : "";
    input_userName(name);
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
  // ポップアップがブロックされる環境向けにリダイレクト方式を使う
  try {
    await firebase
      .auth()
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  } catch (err) {
    console.error("signInWithRedirect error:", err);
    alert(
      "サインイン処理でエラーが発生しました。コンソールを確認してください。"
    );
  }
};

// リダイレクト結果の確認（エラー処理など）
firebase
  .auth()
  .getRedirectResult()
  .then((result) => {
    if (result && result.user) {
      // リダイレクトでサインイン成功
      console.log("Redirect sign-in successful:", result.user.email);
    }
  })
  .catch((error) => {
    // Handle Errors here.
    console.error("getRedirectResult error:", error);
  });

// ログアウト----------------------------------------------
document.getElementById("logout").addEventListener("click", () => {
  // クリックでログアウト（サインアウト）
  firebase
    .auth()
    .signOut()
    .then(() => {
      // サインアウト成功
      document.getElementById("logout").innerText = "ログイン";
    })
    .catch((error) => {
      console.error("signOut error:", error);
    });
});

const input_userName = (userName) => {
  document.getElementById("logout").innerText = userName || "ログイン";
};
//--------------------------------------
//<a href="#" id="logout">logout</a>
