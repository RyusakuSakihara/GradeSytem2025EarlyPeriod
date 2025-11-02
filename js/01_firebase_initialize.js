import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTub6eQdRh5KkRszrOZXFngoni3WQokm8",
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
    const testData = await firestore
      .collection("SystemDev")
      .doc("DevDocument")
      .get();
    console.log("接続テスト成功:", testData.data());
  } catch (error) {
    console.error("接続テストエラー:", error);
  }
};

// 接続確認--------------------------------
// operationTest();

export { Auth, firestore, app };
