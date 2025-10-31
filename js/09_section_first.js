// 表示
async function GPA_home_click(e) {
  // いったん全て非表示
  all_section_hidden();

  // セクション表示
  const firstSection = document.querySelector("section.firstSection");
  firstSection.style.display = "block";

  // ローダー表示
  firstSection.querySelector(".loader3").style.display = "block";

  // GPAデータを取得
  await display_GPA();

  // ローダーを非表示
  firstSection.querySelector(".loader3").style.display = "none";
}

// GPAデータを表に入力する
async function display_GPA() {
  // GPA表示テーブル
  const target_table = document.querySelector("section.firstSection table tbody");

  target_table.innerHTML = "";

  // 表からカリキュラム一覧を取得
  const curriculum_list = list_get_curriculum(target_table);
  // console.log(curriculum_list);

  // firestoreからデータを取得
  const GPA_main_data = await get_GPA_main_data(curriculum_list);

  // 取得したデータを編集して入れる
  // input_GPA_data(GPA_main_data, target_table);
  // 新たに作る
  create_integrate_table(GPA_main_data);
}

// カリキュラム一覧を取得
function list_get_curriculum(target_table) {
  let target_klass = document.querySelector(".displayButton").textContent;

  if (target_klass == "専") {
    target_klass = "専攻科";
  }

  // 学年からカリキュラム一覧を取得
  const target_curriculum = get_curriculum_list(target_klass);

  const curriculum_list = target_curriculum.map((x) => x[3]);

  return curriculum_list;
}

// firestoreからデータを取得
async function get_GPA_main_data(curriculum_list) {
  // firebaseからコレクションを取ってくる
  const GPA_collection = await FirestoreApp.collection("GPA_Subject_Data").get();

  // コレクションの中のドキュメント一覧
  const target_document = GPA_collection.docs;

  // 確認の為にID（科目名）を一覧で取得する。
  const subject_list = [];
  target_document.forEach((item) => {
    subject_list.push(item.id);
  });

  // データがあるものだけ絞ってくる
  const target_list = [];
  curriculum_list.forEach((item) => {
    if (subject_list.indexOf(item) >= 0) {
      target_list.push(item);
    }
  });

  // ビジネスマナーのようにかぶるときに片方を選べるように学年を確認する
  const target_grade = document.getElementsByClassName("displayButton")[0].innerText;

  // docIDからデータを取ってくる
  const GPA_raw_data = [];
  for (let index = 0; index < target_list.length; index++) {
    const element = target_list[index];

    await FirestoreApp.collection("GPA_Subject_Data")
      .doc(element)
      .get()
      .then((item) => {
        const target_data = item.data();

        GPA_raw_data.push([JSON.parse(target_data.main_data), target_data.klass_term, target_data.subject_name]);
        //　GPA一覧確認用
        // console.log([JSON.parse(target_data.main_data), target_data.klass_term, target_data.subject_name]);
      });
  }

  const student_count = student_info.filter((x) => x[6] == target_grade).length;
  // console.log(student_count);
  // console.log(GPA_raw_data);
  const GPA_filtered = GPA_raw_data.filter((x) => x[0].length == student_count);

  return [GPA_filtered, curriculum_list];
}

// データを編集して表に入れる
function input_GPA_data(GPA_raw_data, target_table) {
  // データ確認用のログ
  // console.log(GPA_raw_data);

  // firebaseに保存されている科目名一覧を取得
  const registed_subject_name = GPA_raw_data[0].map((x) => x[2]);

  // 返送用の箱
  const edited_array = [];

  // データを編集
  GPA_raw_data[1].forEach((element, index) => {
    // 表にある科目名が保存されているデータにあるかを確認
    const check_index = registed_subject_name.indexOf(element);

    // console.log(GPA_raw_data[0].length);
    if (GPA_raw_data[0].length > 0) {
      if (index == 0) {
        // 最初の列
        edited_array.push([[element, 0]]); // タイトルに科目名と時間数を入れる
        GPA_raw_data[0][0][0].map((x) => edited_array.push([x[0]])); //　学生の番号
      } else if (index == 1) {
        // ２列目（学生氏名）
        edited_array[0].push([element, 0]); // タイトル（名前）
        GPA_raw_data[0][0][0].map((x) => edited_array[x[0]].push(x[1])); //学生の名前一覧を取得
      } else {
        // データ部分
        if (check_index >= 0) {
          console.log(check_index);
          const subject_title = [element, Number(GPA_raw_data[0][check_index][1])]; // データがあれば時間数も入れる
          console.log(subject_title);
          edited_array[0].push(subject_title);
          GPA_raw_data[0][check_index][0].map((x) => edited_array[x[0]].push(x[3]));
        } else {
          const subject_title = [element, 0]; // データが無ければ０時間とする
          edited_array[0].push(subject_title);
          GPA_raw_data[0][0][0].map((x) => edited_array[x[0]].push("-"));
        }
      }
    }
  });

  // console.log(edited_array);

  // GPAを計算する
  const GPA_total = greade_par_average(edited_array);
  // console.log(GPA_total);

  // GPAの数値を合計の列（３列目）に入れる
  edited_array.forEach((item, index) => {
    item.splice(2, 1, GPA_total[0][index][2]);
  });

  // console.log([edited_array, GPA_total[1]]);
  table_set_GPA_data(edited_array, GPA_total[1], target_table);
}

// 合計のGPAを算出する
function greade_par_average(table_data) {
  // console.log(table_data);
  const header_data = table_data.shift();

  // 合計の返信用の配列
  const Send_Data = [];
  table_data.forEach((item, index) => {
    var sum = 0;
    var allocate = 0;
    header_data.forEach((element, jindex) => {
      if (jindex > 2 && item[jindex] != "-") {
        sum = sum + item[jindex] * element[1];
        allocate = allocate + element[1];
      }
    });

    // 点数×時間、時間数の合計、平均の点数（時間数の合計で割ったもの）
    Send_Data.push([sum, allocate, Math.round((100 * sum) / allocate) / 100]);
  });

  // console.log(Send_Data);
  return [Send_Data, header_data];
}

// テーブルに入れる
async function table_set_GPA_data(body, header, table) {
  // 学年を取得
  const grade = document.getElementById("gradeText").value;

  const export_data = {
    header: JSON.stringify(header),
    body: JSON.stringify(body),
  };

  // console.log([grade, export_data]);

  // firebase に保存
  await FirestoreApp.collection("GPA_export_data").doc(grade).set(export_data);

  // console.log(header);
  // console.log(body);
  // console.log(table);

  // ヘッダーを作る
  const table_header = table.querySelectorAll("th a");
  table_header.forEach((item, index) => {
    if (index > 2) {
      item.innerText = header[index][0].substring(0, 4) + " " + header[index][1];
    }
    // console.log(item.innerText);
  });

  // ボディを入れる
  const table_body = table.querySelectorAll("td");

  // データ行を削除する
  table_body.forEach((item) => {
    item.remove();
  });

  // 行を使いする
  body.forEach((item) => {
    // console.log(item);
    const tr = document.createElement("tr");

    item.forEach((element) => {
      const td = document.createElement("td");
      td.innerText = element;
      if (element == 0) {
        td.style.backgroundColor = "coral";
      } else if (element == 1) {
        td.style.color = "blue";
      } else if (element == 2) {
        td.style.color = "green";
      }
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  // console.log(table_body);
}

// 新たに表を作る
function create_integrate_table(GPA_main_data) {
  // console.log(GPA_main_data);
  // ヘッダーを作る
  const header_data = GPA_header(GPA_main_data[0]);

  // メインのデータを作る
  const edited_main_data = GPA_data_editing(GPA_main_data[0]);

  // メインのテーブルを入れる
  GPA_main_table(edited_main_data);

  // firebaseに保存する
  reserve_firebase(header_data, edited_main_data);
}

// ヘッダーを作る
function GPA_header(data) {
  // console.log(data);
  const table = document.querySelector(".totalGPA tbody");

  // ヘッダーデータを作成
  const header_array = [
    ["", "No"],
    ["", "名前"],
    ["", "GPA"],
  ];

  data.forEach((item, index) => {
    header_array.push([item[1], item[2]]);
  });

  // console.log(header_array);
  // ヘッダーを作成
  const tr = document.createElement("tr");

  header_array.forEach((item, index) => {
    const th = document.createElement("th");

    if (index < 3) {
      th.innerText = item[1];
      tr.appendChild(th);
    } else {
      const a = document.createElement("a");
      const div = document.createElement("div");

      // バルーン表示
      div.classList = "balloon";
      div.innerHTML = `<p>${item[1]}</p>`;

      // 科目名を４字で表示
      a.href = "#";
      a.classList = "GPA_table_header";
      a.innerHTML = four_string(item[1]) + "<br>" + item[0];

      th.appendChild(div);
      th.appendChild(a);
      tr.appendChild(th);
    }
  });

  table.appendChild(tr);

  return header_array;
}

// GPAのメインのデータを作る
function GPA_data_editing(data) {
  // console.log(data);

  const Send_Data = [];

  data.forEach((item, index) => {
    const times = item[1]; // コマ数
    const student = item[0]; // 学生データの配列
    if (index == 0) {
      student.forEach((element) => {
        // [No、名前、[点数×コマ数,コマ数合計]、最初の点数]
        Send_Data.push([element[0], element[1], [element[3] * Number(times), Number(times)], element[3]]);
      });
    } else {
      student.forEach((element, jindex) => {
        Send_Data[jindex].push(element[3]);
        Send_Data[jindex][2][0] = Send_Data[jindex][2][0] + element[3] * Number(times);
        Send_Data[jindex][2][1] = Send_Data[jindex][2][1] + Number(times);
      });
    }
  });

  // console.log(Send_Data);
  return Send_Data;
}

// GPAのデータ部分をテーブルに入れる
function GPA_main_table(data) {
  // console.log(data);
  const table = document.querySelector(".firstSection .totalGPA tbody");

  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    item.forEach((element, jindex) => {
      const td = document.createElement("td");

      if (jindex < 2) {
        td.innerText = element;
      } else if (jindex == 2) {
        const greade_par_average = Math.round((100 * element[0]) / element[1]) / 100;
        td.innerText = greade_par_average;
      } else {
        td.innerText = element;
        if (element == 0) {
          td.style.backgroundColor = "coral";
        } else if (element == 1) {
          td.style.color = "coral";
          td.style.fontWeight = "bold";
        } else if (element == 2) {
          td.style.color = "blue";
          td.style.fontWeight = "bold";
        }
      }

      tr.appendChild(td);
    });

    table.appendChild(tr);
  });
}

// firebaseに保存する
async function reserve_firebase(header, main) {
  // console.log([header, main]);

  const Send_Data = [
    ["", "", ""],
    ["No", "名前", "GPA"],
  ];

  // ヘッダーの最初の３つを入れる
  header.forEach((item, index) => {
    if (index > 2) {
      Send_Data[0].push(item[1]);
      Send_Data[1].push(item[0]);
    }
  });

  // データを入れる
  main.forEach((item, index) => {
    const temp = [];
    item.forEach((element, jindex) => {
      if (jindex == 2) {
        const gpa = Math.round((100 * Number(element[0])) / Number(element[1])) / 100;
        temp.push(gpa);
      } else {
        temp.push(element);
      }
    });
    Send_Data.push(temp);
  });

  // console.log(Send_Data);
  const grade = document.querySelector(".displayButton").innerText;

  const export_data = { export_data: JSON.stringify(Send_Data) };

  await FirestoreApp.collection("GPA_export_data")
    .doc(grade)
    .set(export_data)
    .then(() => {
      console.log("GPA_data reserved!");
    })
    .catch((error) => {
      console.log("GPA reserved error! => " + error);
    });
}
