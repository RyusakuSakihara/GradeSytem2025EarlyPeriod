import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwAvi08g7vVWm-6nHBQJ_mNzhSDEWhcN4",
  authDomain: "grade-2024-ver1.firebaseapp.com",
  projectId: "grade-2024-ver1",
  storageBucket: "grade-2024-ver1.appspot.com",
  messagingSenderId: "398630832647",
  appId: "1:398630832647:web:53c7d0995397331bac38a2",
  measurementId: "G-DP8P0JYWC7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

// 接続確認用-----------------------------
const operationTest = async () => {
  var testData = await firebase.firestore().collection("GPA_Allocation").doc("GPA_Allocation").get();
  console.log(testData.data().Allocation);
};

// 接続確認--------------------------------
// operationTest();

// export { auth, firestore, firebaseConfig };
