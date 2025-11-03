// Firebase compat 初期化スクリプト
// 既存コードが名前空間 API (firebase.firestore(), firebase.auth() 等) を使っているため
// compat ビルドでグローバル変数を作成します。

/* eslint-disable no-undef */
// import { getApiKey } from "./00_getKey";

// 非同期で apiKey を取得してから Firebase を初期化する
// 注意: `getApiKey()` は `js/00_getKey.js` に定義された async 関数で、
//       index.html 上で `00_getKey.js` がこのファイルより先に読み込まれている必要があります。

(async function initFirebaseCompat() {
  try {
    if (typeof getApiKey !== "function") {
      throw new Error(
        "getApiKey is not available. Make sure js/00_getKey.js is loaded before this script."
      );
    }

    // getApiKey は Promise を返す async 関数
    const apiKey = await getApiKey();
    console.log("fetched apiKey:", apiKey);

    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: "grade-2025-early-period.firebaseapp.com",
      projectId: "grade-2025-early-period",
      storageBucket: "grade-2025-early-period.firebasestorage.app",
      messagingSenderId: "873691192868",
      appId: "1:873691192868:web:d2bf5d6df6b28ca62c82b1",
    };

    // firebase compat SDK は index.html で読み込まれている前提
    if (typeof firebase !== "undefined" && firebase.initializeApp) {
      // 初期化は apiKey が取得できた後に実行
      if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized (compat)");
      } else {
        console.log("Firebase already initialized (compat)");
      }

      // 既存コードが参照するグローバル名を作る
      window.FirestoreApp = firebase.firestore();
      window.Auth = firebase.auth();
    } else {
      console.error(
        "Firebase compat SDK not loaded. Make sure firebase-app-compat.js is included before this script."
      );
    }
  } catch (e) {
    console.error("Firebase compat init error:", e);
    // フェールセーフ: APIキー取得に失敗したときの挙動をここで決める
    // 例: エラーメッセージを表示する、もしくは初期化をスキップする
  }
})();
