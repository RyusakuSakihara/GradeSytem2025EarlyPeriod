// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const response = await fetch(__APIKEY_URL);
const data = await response.json();
const apiKey = data.apiKey;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "grade-2025-early-period.firebaseapp.com",
  projectId: "grade-2025-early-period",
  storageBucket: "grade-2025-early-period.firebasestorage.app",
  messagingSenderId: "873691192868",
  appId: "1:873691192868:web:d2bf5d6df6b28ca62c82b1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const Auth = getAuth(app);

// 接続確認用-----------------------------
const operationTest = async () => {
  try {
    // モジュール式 API を使用してドキュメントを取得
    const docRef = doc(firestore, "SystemDev", "DevDocument");
    const testData = await getDoc(docRef);
    if (testData.exists()) {
      console.log("接続テスト成功:", testData.data());
    } else {
      console.log("接続テスト: ドキュメントが見つかりません");
    }
  } catch (error) {
    console.error("接続テストエラー:", error);
  }
};

// 接続確認--------------------------------
operationTest();

export { Auth, firestore, app };
