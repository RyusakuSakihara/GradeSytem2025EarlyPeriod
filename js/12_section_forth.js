// 表示 (評価テスト)
function forthSection_click(e) {
  // いったん全て非表示
  all_section_hidden();

  // 表示
  const firstSection = document.querySelector("section.forthSection");
  firstSection.style.display = "block";

  // 評価テストの対象なのかを確認する
  check_target();
}

// 評価テストを表示するかどうかを確認する
function check_target() {
  // 学年のテキストを取得
  const target_text = document.querySelector(".displayButton").innerText;

  if (target_text == "２民") {
    grade_exam_other();
  } else {
    grade_exam_data(target_text);
  }
}

// 民間用の表示用
function grade_exam_other() {
  document.getElementsByClassName("evaluateError")[0].style.display = "block";
}

// ２年生・専攻科の評価テスト表示用
function grade_exam_data(grade) {
  document.getElementsByClassName("evaluateError")[0].style.display = "none";
  // 模試番号
  const exam_number_range = [
    ["１年", 1000, 1400],
    ["専", 1500, 1600],
    ["２公", 2000, 2500],
  ];

  const exam_filtered = exam_number_range.filter((x) => x[0] == grade);
  const exam_start_number = exam_filtered[0][1];
  const exam_end_number = exam_filtered[0][2];

  let exam_target_range = [];

  if (exam_end_number < 1500) {
    exam_target_range = examStringArray_1st;
  } else {
    exam_target_range = examStringArray_2nd
      .filter((x) => Number(x[0][1]) > exam_start_number)
      .filter((x) => Number(x[0][1]) < exam_end_number);
  }

  // console.log(exam_target_range);
  // データを表にするために加工する
  exam_text_table_edit(exam_target_range);
}

// データから表にするためにデータを編集する
function exam_text_table_edit(exam_target_range) {
  let send_Data = [];

  // ヘッダー部分
  let send_header = [];
  exam_target_range[0].forEach((element, index) => {
    if (index == 0) {
      send_header.push("連番");
      send_header.push("番号");
      send_header.push("名前");
    } else {
      send_header.push(element[0]);
    }
  });

  send_Data.push(send_header);

  // メインのデータを入れる
  exam_target_range.forEach((element, index) => {
    let temp_array = [];
    element.forEach((item, index2) => {
      if (index2 == 0) {
        temp_array.push(item[0]);
        temp_array.push(item[1]);
        temp_array.push(item[2]);
      } else {
        temp_array.push(item[1]);
      }
    });
    send_Data.push(temp_array);
  });

  // console.log(send_Data);
  exam_table_create(send_Data);
}

// 加工されたデータを表を作成して入れる
function exam_table_create(target_data) {
  const row_number = target_data.length;
  const col_number = target_data[0].length;

  // console.log([row_number, col_number]);

  const target_table = document.querySelector(".evaluateTable table tbody");

  // 単純に表を作成する
  for (let index = 0; index < row_number; index++) {
    const tr = document.createElement("tr");
    for (let index2 = 0; index2 < col_number; index2++) {
      if (index == 0) {
        const th = document.createElement("th");
        th.innerText = target_data[index][index2];
        tr.appendChild(th);
      } else {
        const td = document.createElement("td");
        td.innerText = target_data[index][index2];
        tr.appendChild(td);
      }
      target_table.appendChild(tr);
    }
  }
}
