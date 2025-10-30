import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCg_N6lcWu-XqjCVJcl0DZ_hw2i3qPTII4",
  authDomain: "grade-2024-ver2.firebaseapp.com",
  projectId: "grade-2024-ver2",
  storageBucket: "grade-2024-ver2.firebasestorage.app",
  messagingSenderId: "977397479514",
  appId: "1:977397479514:web:a7aac9256a316dfe974063",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const Auth = firebase.auth();

// 接続確認用-----------------------------
const operationTest = async () => {
  var testData = await firestore.collection("SystemDev").doc("DevDocument").get();
  console.log(testData.data());
};

// 接続確認--------------------------------
// operationTest();

// export { auth, firestore, firebaseConfig };
