import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteField,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCg_N6lcWu-XqjCVJcl0DZ_hw2i3qPTII4",
  authDomain: "grade-2024-ver2.firebaseapp.com",
  projectId: "grade-2024-ver2",
  storageBucket: "grade-2024-ver2.firebasestorage.app",
  messagingSenderId: "977397479514",
  appId: "1:977397479514:web:a7aac9256a316dfe974063",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
// console.log(firestore);

// 接続確認用-----------------------------
const operationTest = async () => {
  const TargetCollection = collection(firestore, "KlassCollection");
  var testData = await getDocs(TargetCollection);
  // console.log(testData);

  var Array = [];
  var index = 1;

  var KlassList = query(TargetCollection, where("klass", "in", ["2A", "2B"]));
  var getKlass = await getDocs(KlassList);
  getKlass.forEach((item) => {
    index = index + 1;
    var data = item.data();
    console.log(data);
    if (data.m3) {
      console.log(data["m" + 3]);
    } else {
      console.log(index);
      Array.push([item.id, data]);
      setDoc(doc(TargetCollection, item.id), { ["m" + index]: "message" + index }, { merge: true });
    }
  });
};

// 絞り込み確認用------------------------------------------------
const checkQuery = async () => {
  const attend_collection = collection(firestore, "Attend_Datas");

  const filtered_collection = query(attend_collection, where("Subject_number", ">=", 110), where("Subject_number", "<=", 110));

  const target_docs = await getDocs(filtered_collection);

  target_docs.forEach((item) => {
    console.log(item.id);
  });
};

// 接続確認--------------------------------
// operationTest();
// checkQuery();

// export { firebase, firestore, getFirestore, collection, getDocs, getDoc, query, where, doc, setDoc, updateDoc, deleteField, deleteDoc };
