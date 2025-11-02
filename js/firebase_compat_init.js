// Firebase compat 初期化スクリプト
// 既存コードが名前空間 API (firebase.firestore(), firebase.auth() 等) を使っているため
// compat ビルドでグローバル変数を作成します。

/* eslint-disable no-undef */

const firebaseConfig = {
  apiKey: "AIzaSyCTub6eQdRh5KkRszrOZXFngoni3WQokm8",
  authDomain: "grade-2025-early-period.firebaseapp.com",
  projectId: "grade-2025-early-period",
  storageBucket: "grade-2025-early-period.firebasestorage.app",
  messagingSenderId: "873691192868",
  appId: "1:873691192868:web:d2bf5d6df6b28ca62c82b1",
};

// firebase compat SDK は index.html で読み込まれている前提
if (typeof firebase !== "undefined" && firebase.initializeApp) {
  try {
    // 既に初期化済みであればそれを使う
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
      console.log("Firebase initialized (compat)");
    } else {
      console.log("Firebase already initialized (compat)");
    }

    // 既存コードが参照するグローバル名を作る
    window.FirestoreApp = firebase.firestore();
    window.Auth = firebase.auth();
  } catch (e) {
    console.error("Firebase compat init error:", e);
  }
} else {
  console.error(
    "Firebase compat SDK not loaded. Make sure firebase-app-compat.js is included before this script."
  );
}
