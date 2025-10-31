// 一番上の学年の選択ボタン------------------------------------------
const gradesButton = document.querySelectorAll(".gradesButton");
gradesButton.forEach((button) => {
  button.addEventListener("click", click_gradesButton);
});

// localstrageに使う学年を保存し、呼び出しておく
const gradeText = document.querySelector(".displayButton");
const localStrageLength = localStorage.length;
// console.log(length);
// console.log(localStorage.key(0));
// console.log(localStorage.getItem("FFobj"));
// console.log(localStorage.removeItem("FFobj"));
for (let index = 0; index < localStrageLength; index++) {
  if (localStorage.key(index) == "grade") {
    var local_item = localStorage.getItem("grade");
    gradeText.innerHTML = local_item;
    // console.log(local_item);
    get_kulass_curriculum_filtered(local_item);
  } else {
    localStorage.setItem("grade", "１年");
    // get_kulass_curriculum_filtered("１年");
  }
}

// 一番上の学年の選択ボタンを押すと
function click_gradesButton(e) {
  // 選択した学年
  const selectedGrade = e.target.innerText;
  // 学年を保存
  document.getElementById("gradeText").value = selectedGrade;
  // 選択した学年を表示
  document.querySelector(".displayButton").innerHTML = selectedGrade;
  // ローカルに保存
  localStorage.setItem("grade", selectedGrade);
  // クラス選択ボタンを作成
  get_kulass_curriculum_filtered(selectedGrade);
}
