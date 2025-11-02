// ページロード時にlocalStorageからユーザー名を復元
window.addEventListener("DOMContentLoaded", () => {
  const savedName = localStorage.getItem("userName");
  if (savedName) {
    input_userName(savedName);
  }
});
// ログインしていなかったら---------------------------------
// 以前はリダイレクト方式を使っていましたが、ポップアップ方式に切り替えました。
// onAuthStateChanged がサインイン後の表示更新を担当するため、ここでのリダイレクト結果確認は不要です。

// 認証状態の監視
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    // 表示用の名前を user.displayName を優先して取得し、無ければメールの@より前を使う
    const getDisplayName = (u) => {
      if (!u) return "";
      // displayName があればそれを使う
      if (u.displayName && String(u.displayName).trim() !== "")
        return String(u.displayName).trim();
      // なければメールの@より前を使う
      if (u.email) return String(u.email).split("@")[0];
      return "";
    };

    const name = getDisplayName(user);
    input_userName(name);
    localStorage.setItem("userName", name);
    // console.log(user.email || user.displayName);
  } else {
    //ログインが確認できなかったら
    const result = window.confirm("ログインしますか。");
    if (result) {
      Sign_In_google();
    } else {
      input_userName("");
      localStorage.removeItem("userName");
    }
  }
});

// サインインをポップアップで-----------------------------------------------------------
const Sign_In_google = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    // ポップアップでサインイン成功したら即時に表示更新しておく
    if (result && result.user) {
      const getDisplayName = (u) => {
        if (!u) return "";
        if (u.displayName && String(u.displayName).trim() !== "")
          return String(u.displayName).trim();
        if (u.email) return String(u.email).split("@")[0];
        return "";
      };
      const name = getDisplayName(result.user);
      input_userName(name);
      localStorage.setItem("userName", name);
      console.log(
        "Popup sign-in successful:",
        result.user.email || result.user.displayName
      );
    }
  } catch (err) {
    // 広告ブロッカーやブラウザのポップアップブロックは無視
    if (
      (err && err.message && err.message.includes("ERR_BLOCKED_BY_CLIENT")) ||
      (err && err.code && err.code === "auth/popup-blocked")
    ) {
      // ユーザーに侵入的なエラーは表示しない
      console.warn("Popup blocked or blocked by client:", err);
      return;
    }
    // ユーザーがポップアップを閉じたなどのエラーはログのみ
    if (
      err &&
      err.code &&
      (err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request")
    ) {
      console.info("Popup sign-in cancelled or closed by user:", err.code);
      return;
    }
    console.error("signInWithPopup error:", err);
    alert(
      "サインイン処理でエラーが発生しました。コンソールを確認してください。"
    );
  }
};

// ...existing code...

// ログアウト----------------------------------------------
document.getElementById("logout").addEventListener("click", () => {
  // クリックでログアウト（サインアウト）
  firebase
    .auth()
    .signOut()
    .then(() => {
      // サインアウト成功
      document.getElementById("logout").innerText = "ログイン";
      localStorage.removeItem("userName");
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
