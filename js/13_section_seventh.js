// 表示
function seventhSection_click(e) {
  // いったん全て非表示
  all_section_hidden();

  // 表示
  const seventhSection = document.querySelectorAll("section.seventhSection .wrapper");
  document.querySelector("section.seventhSection").style.display = "block";
  seventhSection[0].style.display = "block";
  seventhSection[1].style.display = "none";

  // 科目選択ボタンを作成
  create_subject_selector_GPA();

  // 最初の科目を選択
  firstButton();
}

// ボタンを作成---------------------------------------------------------
function create_subject_selector_GPA() {
  // ボタンを作成するul
  const subject_select_ul = document.querySelector(".seventhSection ul");

  //一度ボタンを削除
  subject_select_ul.innerHTML = "";

  //学年を取得
  const grade = document.querySelector(".displayButton").innerHTML;

  // カリキュラムリストを取得
  const curriculum_list = get_curriculum_list(grade);
  // console.log(curriculum_list);

  // ボタンを作成
  curriculum_list
    .map((x) => x[3])
    .forEach((item, index) => {
      // console.log(item);

      const li = document.createElement("li");

      li.innerHTML = `<a href="#" class="subjectName subjectAnime${index + 1}">${item}</a>`;

      subject_select_ul.appendChild(li);
    });

  // 科目を選択すると
  document.querySelectorAll(".seventhSection .subjectName").forEach((element) => {
    element.addEventListener("click", selectedSubject_seventh);
  });
}

// 最初のボタンをフォーカス------------------------------------------
function firstButton() {
  document.querySelectorAll(".seventhSection .subjectName")[0].focus();
}

// ----------------------------------------------------------------
// 科目を選択すると--------------------------------------------------
function selectedSubject_seventh(element) {
  // 選択した科目を保存
  document.getElementById("targetSubject").value = element.target.innerText;

  // 科目ボタンを非表示
  document.querySelectorAll("section.seventhSection .wrapper")[0].style.display = "none";

  // 表タイトルを表示
  document.querySelectorAll("section.seventhSection .wrapper")[1].style.display = "block";

  // 表を非表示
  document.querySelector("section.seventhSection table").style.display = "none";

  // タイトルに科目名をつける
  document.querySelector(".seventhSection .wrapper h1").innerText = "科目別集計（" + element.target.innerText + "）";

  // firebaseから科目のデータを取ってくる
  GPA_total_data(element.target.innerText);
}

// firebaseから科目のデータを取ってくる
async function GPA_total_data(element) {
  // 学年
  const grade = document.querySelector(".displayButton").innerHTML;

  // 科目名
  const subject_name = element;

  // クラスとカリキュラムの取得
  const klass_and_curriculum = klass_curriculum_relation;

  // 対象のクラス一覧を取得
  const klass_list = klass_and_curriculum.filter((x) => x[3] == grade).map((x) => x[2]);

  // GPA配点データの取得
  const Allocation = await Get_GPA_Allocation();
  const Allocate_point = Allocation[0].filter((x) => x.Allocate_Name == element);
  const Allocate_rate = Allocation[1];
  // console.log(Allocate_rate);

  // 操作とコレクション名の取得（態度、課題、ミニテスト）
  const apply_and_collect = apply_collect_relation;
  // console.log(apply_and_collect);

  // 出席データの取得
  const attend_datas = await get_attend_datas(subject_name, klass_list);

  // 名前一覧の取得
  var Student_List = [];
  attend_datas.map((x) => x.map((y) => y[1])).map((x) => x.map((y) => Student_List.push(y)));
  // console.log(Student_List);

  // 授業態度の取得
  const attitude_datas = await get_attitude_datas(subject_name, klass_list, Student_List);
  // console.log(attitude_datas);

  // 課題点の取得
  const task_datas = await get_task_datas(subject_name, klass_list, Student_List);
  // console.log(task_datas);

  // ミニテストの取得
  const minitest_datas = await get_minitest_datas(subject_name, klass_list, Student_List);
  // console.log(minitest_datas);

  // 評価テストの取得（模試や週テスト）
  const evaluate_test_data = await get_evaluate_test(subject_name, klass_list, Student_List, grade);
  // console.log(evaluate_test_data);

  // データをまとめて一つの配列にする
  await integration_datas(
    grade,
    subject_name,
    Allocate_point,
    Allocate_rate,
    attend_datas,
    Student_List,
    attitude_datas,
    task_datas,
    minitest_datas,
    evaluate_test_data
  );
}

// 出席データの取得
async function get_attend_datas(subject_name, klass_list) {
  // 返信用のデータ
  var Send_Data = [];

  // 専攻科の名前の部分を補正
  if (klass_list[0] == "専") {
    klass_list[0] = "専攻科";
  }

  // クラスの数だけ回す
  for (let index = 0; index < klass_list.length; index++) {
    const attend_datas = await FirestoreApp.collection("Attend_Datas").doc(subject_name).collection("klasses").doc(klass_list[index]).get();

    // console.log(attend_datas);

    if (attend_datas.exists) {
      Send_Data.push(JSON.parse(attend_datas.data().Attend_Rate));

      // 授業時間数を一時的に保存する
      document.getElementById("term_count").value = attend_datas.data().Execute_Number;
    }
  }

  return Send_Data;
}

// 態度点の取得
async function get_attitude_datas(subject_name, klass_list, Student_List) {
  // 返送用の配列
  var Send_Data = Student_List.map((x) => [0, 0, x, 0, 0]);

  for (let index = 0; index < klass_list.length; index++) {
    let element = klass_list[index];

    if (element == "専攻科") {
      element = "専";
    }

    // console.log(element);

    const attitude_datas = await FirestoreApp.collection("Attitude_Total").doc(subject_name).collection(element).get();

    // console.log(attitude_datas);

    // データの有無を調べる
    if (!attitude_datas.empty) {
      attitude_datas.docs.forEach((element, index) => {
        const target_array = JSON.parse(element.data().Send_Total);

        Student_List.forEach((name, jindex) => {
          const target_student = target_array.filter((x) => x[2] == name);

          if (target_student.length > 0) {
            Send_Data[jindex][0] = target_student[0][0];
            Send_Data[jindex][1] = target_student[0][1];
            Send_Data[jindex][3] = target_student[0][3] + Send_Data[jindex][3];
            Send_Data[jindex][4] = target_student[0][4] + Send_Data[jindex][4];
          }
        });
      });
    }
  }

  return Send_Data;
}

// 態度点の取得
async function get_task_datas(subject_name, klass_list, Student_List) {
  // 返送用の配列
  var Send_Data = Student_List.map((x) => [0, 0, x, 0, 0]);

  for (let index = 0; index < klass_list.length; index++) {
    let element = klass_list[index];

    if (element == "専攻科") {
      element = "専";
    }

    const task_datas = await FirestoreApp.collection("Task_Total").doc(subject_name).collection(element).get();

    // データの有無を調べる
    if (!task_datas.empty) {
      task_datas.docs.forEach((element, index) => {
        const target_array = JSON.parse(element.data().Send_Total);

        Student_List.forEach((name, jindex) => {
          const target_student = target_array.filter((x) => x[2] == name);

          if (target_student.length > 0) {
            Send_Data[jindex][0] = target_student[0][0];
            Send_Data[jindex][1] = target_student[0][1];
            Send_Data[jindex][3] = target_student[0][3] + Send_Data[jindex][3];
            Send_Data[jindex][4] = target_student[0][4] + Send_Data[jindex][4];
          }
        });
      });
    }
  }

  return Send_Data;
}
// ミニテストの取得
async function get_minitest_datas(subject_name, klass_list, Student_List) {
  // 返送用の配列
  var Send_Data = Student_List.map((x) => [0, 0, x, 0, 0]);

  for (let index = 0; index < klass_list.length; index++) {
    let element = klass_list[index];

    if (element == "専攻科") {
      element = "専";
    }

    const minitest_datas = await FirestoreApp.collection("MiniTest_Total").doc(subject_name).collection(element).get();

    // データの有無を調べる
    if (!minitest_datas.empty) {
      minitest_datas.docs.forEach((element, index) => {
        const target_array = JSON.parse(element.data().Send_Total);

        Student_List.forEach((name, jindex) => {
          const target_student = target_array.filter((x) => x[2] == name);

          if (target_student.length > 0) {
            Send_Data[jindex][0] = target_student[0][0];
            Send_Data[jindex][1] = target_student[0][1];
            Send_Data[jindex][3] = target_student[0][3] + Send_Data[jindex][3];
            Send_Data[jindex][4] = target_student[0][4] + Send_Data[jindex][4];
          }
        });
      });
    }
  }

  return Send_Data;
}

// 模試や週テストの取得☆彡☆彡☆彡☆彡☆彡☆彡☆彡☆彡☆彡☆彡☆彡
async function get_evaluate_test(subject_name, klass_list, Student_List, grade) {
  // console.log(relation_evaluate_list);
  // console.log(subject_name);
  // console.log(grade);
  const target_doc_name = relation_evaluate_list.filter((x) => x[0] == grade)[0][1];
  // console.log(subject_name);

  // 評価テストのデータの取得
  // const evaluate_datas = await FirestoreApp.collection("evaluate_test").doc(target_doc_name).collection(subject_name).get();
  let evaluate_datas = [];
  if (target_doc_name == "2nd_list") {
    evaluate_datas = examStringArray_2nd;
  } else {
    evaluate_datas = examStringArray_1st;
  }

  // 返送用のデータ
  var Send_Data = Student_List.map((x) => [0, x, 0, 0]);

  // データ確認用
  // console.log(evaluate_datas);

  // データがあったら
  if (evaluate_datas.length > 0) {
    Send_Data.forEach((item, index) => {
      evaluate_datas.forEach((target) => {
        // 学生氏名が一致したら
        if (item[1] == target[0][2]) {
          Send_Data[index][0] = index + 1;
          Send_Data[index][2] = checkSubjectFilter(target, subject_name);
          Send_Data[index][3] = 100;
        }
      });
    });
  }

  // console.log(Send_Data);
  return Send_Data;
}

// 科目名から得点率を絞り込む---------------------------------------------------
function checkSubjectFilter(oneData, subjectName) {
  // カリキュラム科目名から模試科目名にする
  const examTextName = subject_relation_data.filter((x) => x[3] == subjectName);
  // console.log(examTextName[0][6]);

  // 科目で絞り込む
  let replyData = 0;
  if (examTextName[0][6].length > 0) {
    replyData = Number(oneData.filter((x) => x[0] == examTextName[0][6])[0][1]);
  }

  return replyData;
}

// データをまとめて、一つの配列にする-------------------------------------------------
async function integration_datas(
  grade,
  subjectName,
  Allocate_point,
  Allocate_rate,
  attend_datas,
  Student_List,
  attitude_datas,
  task_datas,
  minitest_datas,
  evaluate_datas
) {
  // 返信用の配列
  var Send_Data = [];

  // ヘッダーデータ
  var header_array = [
    ["", grade],
    ["", "名前"],
    ["", "出席率"],
    ["配点", Allocate_point[0].Attend_Points[4]],
    ["", "態度点"],
    ["配点", Allocate_point[0].Attitude_Points[4]],
    ["", "課題点"],
    ["配点", Allocate_point[0].Task_Points[4]],
    ["", "ミニテスト"],
    ["配点", Allocate_point[0].Mini_Test_Points[4]],
    ["", "評価テスト"],
    ["配点", Allocate_point[0].Evaluation_Points[4]],
    ["合計", 100],
    ["", "優良可"],
    ["", "GPA"],
  ];

  // ヘッダーを入れておく
  Send_Data.push(header_array);

  // 学生一覧を使って、各学生のデータを取り出す☆☆☆壮大なループ
  Student_List.forEach((item, index) => {
    var temp_array = [];

    temp_array.push(index + 1);
    temp_array.push(item);

    // 出席率データ
    const Attend_Points = take_attend_point(Allocate_point, Allocate_rate, attend_datas, item);
    Attend_Points.map((x) => temp_array.push(x));

    // 態度点の取得
    const Attitude_Points = take_input_point(Allocate_point[0].Attitude_Points, Allocate_rate.Attitude_Points, attitude_datas, item);
    Attitude_Points.map((x) => temp_array.push(x));

    // 課題点の取得
    const Task_Points = take_input_point(Allocate_point[0].Task_Points, Allocate_rate.Task_Points, task_datas, item);
    Task_Points.map((x) => temp_array.push(x));

    // ミニテスト点の取得
    const Minitest_Points = take_input_point(Allocate_point[0].Mini_Test_Points, Allocate_rate.Mini_Test_Points, minitest_datas, item);
    Minitest_Points.map((x) => temp_array.push(x));

    // 評価テスト
    const Evaluation_Points = take_evaluate_point(
      Allocate_point[0].Evaluation_Points,
      Allocate_rate.Evaluation_Points,
      evaluate_datas,
      item
    );
    Evaluation_Points.map((x) => temp_array.push(x));

    // 合計点
    const summation_point = Attend_Points[1] + Attitude_Points[1] + Task_Points[1] + Minitest_Points[1] + Evaluation_Points[1];
    temp_array.push(summation_point);

    // 優良可を決める
    var evaluate_strings = "";
    Final_Total_Point[0].forEach((item, index) => {
      if (item < summation_point) {
        evaluate_strings = Final_Total_Point[2][index];
      }
    });

    // GPAの点数をつける
    var GPA_Number = 0;
    Final_Total_Point[0].forEach((item, index) => {
      if (item < summation_point) {
        GPA_Number = Final_Total_Point[1][index];
      }
    });

    // 出席率80％より下で不可
    if (Attend_Points[0] < 80) {
      temp_array.push("不可");
      temp_array.push(0);
    } else {
      temp_array.push(evaluate_strings);
      temp_array.push(GPA_Number);
    }

    Send_Data.push(temp_array);
  });

  // 表を作成する
  // console.log(Send_Data);
  create_subject_GPA(Send_Data);

  // firebaseへ保存する
  reserve_GPA(Send_Data);
}

// 出席率の取り出し
function take_attend_point(Allocate_point, Allocate_rate, attend_datas, student) {
  // 出席データを入れる箱
  var Attend_Points = [];

  attend_datas.forEach((element) => {
    var temp_array = element.filter((x) => x[1] == student);

    if (temp_array.length > 0) {
      // 出席率
      const temp_rate = Math.round(temp_array[0][2] * 1000) / 10;
      Attend_Points.push(temp_rate);

      // 出席率の点
      var temp_point = 0;
      Allocate_rate.Attend_Points.forEach((item, index) => {
        if (item < temp_rate) {
          temp_point = Allocate_point[0].Attend_Points[index];
        }
      });

      Attend_Points.push(temp_point);
    }
  });

  return Attend_Points;
}

// 態度、課題、ミニテスト点の取り出し
function take_input_point(Allocate_point, Allocate_rate, target_datas, student) {
  // 返送用の箱
  var Points_Array = [];

  // 対象の学生の配列を取得
  const target_array = target_datas.filter((x) => x[2] == student)[0];

  if (target_array.length > 0) {
    // 得点率を算出する
    const target_rate = Math.round((1000 * Number(target_array[3])) / Number(target_array[4])) / 10;
    Points_Array.push(target_rate);

    // 率から得点をわりだす。
    var temp_point = 0;
    Allocate_rate.forEach((item, index) => {
      if (item < target_rate) {
        temp_point = Allocate_point[index];
      }
    });

    Points_Array.push(temp_point);
  }

  return Points_Array;
}

// 模試・週テスト点の取得
function take_evaluate_point(Allocate_point, Allocate_rate, target_datas, student) {
  // 返送用の箱
  var Points_Array = [];

  // 対象の学生の配列を取得
  const target_array = target_datas.filter((x) => x[1] == student)[0];

  if (target_array.length > 0) {
    // 得点率を算出する
    // const target_rate = (Math.round(Number(target_array[2]) / Number(target_array[3])) * 1000) / 10;
    var target_rate = 0;
    if (Number(target_array[2]) > 0) {
      target_rate = Math.round((1000 * Number(target_array[2])) / Number(target_array[3])) / 10;
    } else {
      target_rate = 100;
    }
    // console.log(target_rate);
    Points_Array.push(target_rate);

    // 率から得点をわりだす。
    var temp_point = 0;
    Allocate_rate.forEach((item, index) => {
      if (item < target_rate) {
        temp_point = Allocate_point[index];
      }
    });

    Points_Array.push(temp_point);
  }
  // console.log(Points_Array);
  return Points_Array;
}

// 表を作成する
function create_subject_GPA(subject_GPA) {
  // console.log(subject_GPA);
  const target_table = document.querySelector(".subjectGPA_Table tbody");
  // console.log(target_table);

  const header_array = subject_GPA.shift();
  // console.log(subject_GPA);

  target_table.innerHTML = "";

  const htr = document.createElement("tr");

  // ヘッダーの作成
  header_array.forEach((item) => {
    const th = document.createElement("th");
    th.innerHTML = item[0] + "<br>" + item[1];
    htr.appendChild(th);
  });
  target_table.appendChild(htr);

  // データ部分を入れる
  subject_GPA.forEach((item) => {
    var tr = document.createElement("tr");
    item.forEach((element) => {
      const td = document.createElement("td");
      td.innerText = element;
      tr.appendChild(td);
    });

    if (item[2] < 80) {
      tr.classList = "GPA_row_red";
    }

    target_table.appendChild(tr);
  });

  // 表を表示
  document.querySelector("section.seventhSection table").style.display = "inline-block";

  // ローダーを非表示
  document.querySelector(".GPA_total_loader").style.display = "none";
}

// firebaseに科目別のＧＰＡに保存する
function reserve_GPA(GPA_datas) {
  // console.log(GPA_datas);

  const main_data = GPA_datas.map((x) => [x[0], x[1], x[13], x[14]]);

  const grade = document.getElementById("gradeText").value;
  const subject_name = document.getElementById("targetSubject").value;
  const klass_term = document.getElementById("term_count").value;

  const reserve_data = {
    subject_name: subject_name,
    klass_term: klass_term,
    main_data: JSON.stringify(main_data),
  };

  if (klass_term > 0) {
    FirestoreApp.collection("GPA_Subject_Data")
      .doc(subject_name)
      .set(reserve_data)
      .then(() => {
        console.log("subject_GPA_reserved");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
