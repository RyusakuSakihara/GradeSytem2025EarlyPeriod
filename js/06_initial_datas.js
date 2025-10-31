//firebase
const FirestoreApp = firebase.firestore();

//得点率データ-----------------------------------------------------
var Get_GPA_Allocation = async () => {
  var Allocation_Data = await FirestoreApp.collection("GPA_Allocation").doc("GPA_Allocation").get();

  var Send_Allocation_Data = JSON.parse(Allocation_Data.data().Allocation);
  var Send_Ratinig_Data = JSON.parse(Allocation_Data.data().Rateing);

  return [Send_Allocation_Data, Send_Ratinig_Data];
};
