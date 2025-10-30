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
  const grade = document.querySelector(".displayButton").innerText;

  // 学年からカリキュラム一覧を取得(３列目に科目名)
  const target_curriculum = get_curriculum_list(grade).map((x) => x[0]);

  // 出席データを取得して編集する
  var Edited_Attend_Data = await Attend_Data_Edit2(target_curriculum, klass_name);

  // console.log(Edited_Attend_Data);
  // テーブルを表示する
  Attend_Table_Setting(Edited_Attend_Data);

  // loaderを非表示にする
  document.querySelector(".loader").style.display = "none";
}

// 出生率のデータを取り込む--------------------------------------------------
async function Attend_Data_Capture(klass, subject) {
  // パスの作成
  const path = subject + klass;

  // 出席率の取込
  const Attend_Datas = await FireStoreApp.collection("Attend_Datas").doc(path).get();

  return Attend_Datas.data();
}

// 出席率のデータから表に入れる配列を作る
async function Attend_Data_Edit2(target_curriculum, klass_name) {
  //データを保存する配列
  var Send_Data = [];

  // クラス番号と科目番号を合わせてドキュメントIDの配列を作成
  target_klass = klass_and_curriculum.filter((x) => x[2] == klass_name)[0][0];
  const path_array = target_curriculum.map((x) => x + target_klass);

  // 配列から一気に必要なデータを取得
  const conbin_array = await FireStoreApp.collection("Attend_Datas")
    .where(firebase.firestore.FieldPath.documentId(), "in", path_array)
    .get();

  // 返送用
  var resend_data = [
    ["", ""],
    ["No", "名前"],
  ];

  // 指数
  var figures = 0;

  // データを加工
  conbin_array.forEach((item) => {
    const export_datas = item.data();

    // 実施時間が０以上だけ表示
    if (export_datas.Execute_Number > 0) {
      resend_data[0].push(export_datas.Subject_Name);
      resend_data[1].push(export_datas.Execute_Number);

      // 名前や出席番号を登録
      if (figures == 0) {
        JSON.parse(export_datas.Attend_Rate).forEach((data) => {
          resend_data.push([data[0], data[1], data[2]]);
        });
      } else {
        JSON.parse(export_datas.Attend_Rate).forEach((data, i) => {
          resend_data[i + 2].push(data[2]);
          // console.log(i);
        });
      }
      figures = figures + 1;
    }
  });

  // console.log(resend_data);

  return resend_data;
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
