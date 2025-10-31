// 表示
function secondSection_click(e) {
  // いったん全て非表示
  all_section_hidden();

  // 表示
  const firstSection = document.querySelector("section.secondSection");
  firstSection.style.display = "block";

  // クラス選択ボタン
  const klass_buttons = document.querySelectorAll(".attendKlassSelect .klassName");
  klass_buttons.forEach((item, index) => {
    item.addEventListener("click", attend_klass_push);
  });

  // 最初のクラスのボタンをクリック
  klass_buttons[0].click();
  klass_buttons[0].focus();
}

// クラス選択ボタンを押すと---------------------------------------------------
function attend_klass_push(e) {
  // loaderを表示する
  document.querySelector(".secondSection .loader").style.display = "grid";

  // テーブルをリセットする
  document.querySelector(".attendTable table tbody").innerHTML = "";

  // テーブルを作成する
  Attend_Table_Create(e.target.innerText);
}

// 出席率を取得--------------------------------------------------
async function Attend_Table_Create(klass_name) {
  // 学年の取込
  const grade = document.getElementById("gradeText").value;
  // console.log(grade);

  // 学年からカリキュラム一覧を取得(３列目に科目名)
  const target_curriculum = get_curriculum_list(grade).map((x) => x[3]);

  // 出席データを取得して編集する
  var Edited_Attend_Data = await Attend_Data_Edit2(target_curriculum, klass_name);

  // console.log(Edited_Attend_Data);
  // テーブルを表示する
  Attend_Table_Setting(Edited_Attend_Data);

  // loaderを非表示にする
  document.querySelector(".loader").style.display = "none";
}

// 出生率のデータを取り込む--------------------------------------------------
async function Attend_Data_Capture(target_klass, subject_name) {
  // console.log(subject_name);
  // console.log(target_klass);
  if (target_klass == "専") {
    target_klass = "専攻科";
  }
  // 出席率の取込
  const Attend_Datas = await FirestoreApp.collection("Attend_Datas").doc(subject_name).collection("klasses").doc(target_klass).get();

  return Attend_Datas.data();
}

// 出席率のデータから表に入れる配列を作る
async function Attend_Data_Edit2(target_curriculum, klass_name) {
  //データを保存する配列
  var Send_Data = [];

  for (let index = 0; index < target_curriculum.length; index++) {
    var attend_datas = await Attend_Data_Capture(klass_name, target_curriculum[index]);

    // 授業時間が０以上のみ
    if (!!attend_datas) {
      if (attend_datas.Execute_Number > 0) {
        if (Send_Data.length == 0) {
          // 最初の一回目

          Send_Data.push(["", "", attend_datas.Subject_Name]);
          Send_Data.push(["No", "名前", attend_datas.Execute_Number]);

          // 番号、氏名、出席率をプッシュ！
          JSON.parse(attend_datas.Attend_Rate).forEach((data) => {
            Send_Data.push([data[0], data[1], data[2]]);
          });
        } else {
          // ２回目以降
          Send_Data[0].push(attend_datas.Subject_Name);
          Send_Data[1].push(attend_datas.Execute_Number);
          // 出席率だけプッシュ
          JSON.parse(attend_datas.Attend_Rate).forEach((data, num) => {
            Send_Data[num + 2].push(data[2]);
          });
        }
      }
    }
  }
  return Send_Data;
}

// テーブルを作成する
function Attend_Table_Setting(input_Array) {
  const Attend_Table = document.querySelector(".attendTable table tbody");

  input_Array.forEach((item, index) => {
    const tr = document.createElement("tr");

    input_Array[index].forEach((element, num) => {
      if (index < 2) {
        const th = document.createElement("th");
        if (element.length > 0) {
          // バルーン表示
          const div = document.createElement("div");
          div.classList = "balloon";
          div.innerHTML = `<p>${element}</p>`;

          const a = document.createElement("a");
          a.href = "#";
          a.classList = "GPA_table_heaer";
          a.innerText = four_string(element);
          // th.innerText = four_string(element);

          th.appendChild(div);
          th.appendChild(a);
        } else {
          th.innerText = element;
        }
        tr.appendChild(th);
      } else {
        const td = document.createElement("td");

        if (index > 1 && num > 1) {
          const attend_rate = Math.round(element * 1000) / 10;

          td.innerText = attend_rate;
          if (attend_rate < 80) {
            td.style.backgroundColor = "coral";
          }

          tr.appendChild(td);
        } else {
          td.innerText = element;
          tr.appendChild(td);
        }
      }
    });
    Attend_Table.appendChild(tr);
  });
}
