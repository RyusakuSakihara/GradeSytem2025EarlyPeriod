// 学年からクラスをチョイス-------------------------------------------
async function get_kulass_curriculum_filtered(params) {
  //その学年のクラスデータを取得
  const filtered_klass = klass_curriculum_relation.filter((x) => x[3] == params);

  // クラスの略称一覧を取得
  var klass_names = filtered_klass.map((x) => x[2]);

  //　クラス選択ボタンを作成
  klass_choice_Button(klass_names);

  // 学年から学生氏名を取得
  const target_students = await get_student_list(params);

  // 学年からカリキュラム一覧を取得
  const target_curriculum = get_curriculum_list(params);
}

// クラスデータからクラス選択ボタンを作成--------------------------------
function klass_choice_Button(klass_names) {
  let attend_ul = document.querySelector(".attendKlassSelect ul");
  let third_ul = document.querySelector(".thirdSection .KlassSelect ul");

  attend_ul.innerHTML = "";
  third_ul.innerHTML = "";

  //   console.log(klass_names);
  klass_names.forEach((element) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.classList = "klassName";
    a.innerText = element;
    li.appendChild(a);
    attend_ul.appendChild(li);
  });

  klass_names.forEach((element) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    a.classList = "klassName";
    a.innerText = element;
    li.appendChild(a);
    third_ul.appendChild(li);
  });
}

// クラス名一覧から学生データを取得----------------------------------
async function get_student_list(grade) {
  const Student_List = student_info;
  const target_students = Student_List.filter((x) => x[6] == grade);
  return target_students;
}

// カリキュラム一覧を学年から取得-------------------------------------
function get_curriculum_list(grade) {
  return subject_relation_data.filter((x) => x[1] == grade);
}
//
// GPAの表に学生氏名を登録--------------------------------------------
function gpa_table_student(target_students, target_curriculum) {
  const gpa_table = document.querySelector(".firstSection .totalGPA tbody");
  gpa_table.innerHTML = "";

  // 学生とカリキュラムの数を取得
  const student_number = target_students.length;
  const curriculum_number = target_curriculum.length;
  //   console.log([student_number, curriculum_number]);
  //   console.log(target_curriculum);

  var input_curriculum_data = target_curriculum.map((x) => x[3]);

  input_curriculum_data.unshift("No", "名前", "GPA");

  //   console.log(input_curriculum_data);

  // 箱を作成する
  for (let i = 0; i < student_number + 1; i++) {
    //行
    const tr = document.createElement("tr");

    // クラスが異なる部分に線を引く
    if (i > 0 && i < student_number) {
      if (target_students[i - 1][1] != target_students[i][1]) {
        tr.classList = "klass_divide_bottomline";
      }
    }

    for (let j = 0; j < curriculum_number + 2; j++) {
      //列
      if (i < 1) {
        //ヘッダーの作成
        const th = document.createElement("th");
        const a = document.createElement("a");
        const div = document.createElement("div");

        // バルーン表示
        div.classList = "balloon";
        div.innerHTML = `<p>${input_curriculum_data[j]}</p>`;
        // a.appendChild(div);

        a.href = "#";
        a.classList = "GPA_table_header";
        a.innerText = four_string(input_curriculum_data[j]);

        th.appendChild(div);
        th.appendChild(a);
        tr.appendChild(th);
      } else {
        //　学生氏名の登録
        const td = document.createElement("td");
        if (j == 0) {
          td.innerHTML = target_students[i - 1][2];
        }
        if (j == 1) {
          td.innerHTML = `<input type='text' value = ${target_students[i - 1][0]} hidden >${target_students[i - 1][3]}`;
          // td.innerText = target_students[i - 1][3];
        }
        tr.appendChild(td);
      }
    }

    gpa_table.appendChild(tr);
  }
}

// ５文字限定にする---------------------------------------
function four_string(params) {
  // var send_strings = ""

  if (params == "") {
    return params;
  } else {
    return params.substring(0, 4);
  }
}

// 全非表示-----------------------------------------------------------------
function all_section_hidden() {
  document.querySelectorAll("section").forEach((element, index) => {
    if (index > 0) {
      element.style.display = "none";
    }
  });
}

//キーボードでメニューを選択出来るようにする---------------------------------
document.querySelector("body").addEventListener("keydown", keydown);

function keydown(key) {
  if (!isNaN(key.key)) {
    if (key.key > 0 && key.key < 8) {
      document.querySelectorAll("section.navigation a")[key.key - 1].focus();
    }
    if (key.key == 0) {
      document.querySelector(".displayButton").focus();
    }
  }
}

// ロードしたら
window.onload = () => {
  document.querySelector(".displayButton").focus();

  document.querySelector(".naviAnime1").addEventListener("click", GPA_home_click);

  document.querySelector(".naviAnime2").addEventListener("click", secondSection_click);

  document.querySelector(".naviAnime3").addEventListener("click", thirdSection_click);

  document.querySelector(".naviAnime4").addEventListener("click", thirdSection_click);

  document.querySelector(".naviAnime5").addEventListener("click", thirdSection_click);

  document.querySelector(".naviAnime6").addEventListener("click", forthSection_click);

  document.querySelector(".naviAnime7").addEventListener("click", seventhSection_click);
};
