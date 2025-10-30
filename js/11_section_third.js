// 表示-------------------------------------------------------------
function thirdSection_click(e) {
  // いったん全て非表示
  all_section_hidden();

  // 操作を保存
  document.getElementById("selectedAppli").value = e.target.innerText;

  // 表示
  const firstSection = document.querySelector("section.thirdSection");
  firstSection.style.display = "block";

  // thirdSectionの中の表示をリセット
  thirdSection_reset();

  // 科目ボタンを作成
  create_subject_selector();

  // 科目ボタンをクリックすると
  document.querySelectorAll(".subjectName").forEach((element) => {
    element.addEventListener("click", selectedSubject);
  });

  // 新規作成のボタンを押すと
  document.querySelector(".newAddition").addEventListener("click", newAddition);

  // 戻るボタンを押すと
  document.querySelector(".return").addEventListener("click", return_button_push);

  // 保存ボタンを押すと
  document.querySelector(".regist").addEventListener("click", regist_button_click);

  // 削除ボタンを押すと
  document.querySelector(".delete").addEventListener("click", Delete_button_click);
}

// ボタンを作成---------------------------------------------------------
function create_subject_selector() {
  // ボタンを作成するul
  const subject_select_ul = document.querySelector(".thirdSection ul");

  //一度ボタンを削除
  subject_select_ul.innerHTML = "";

  //学年を取得
  const grade = document.querySelector(".displayButton").innerHTML;

  // カリキュラムリストを取得
  const curriculum_list = get_curriculum_list(grade);

  // ボタンを作成
  curriculum_list
    .map((x) => x[3])
    .forEach((item, index) => {
      // console.log(item);

      const li = document.createElement("li");

      li.innerHTML = `<a href="#" class="subjectName subjectAnime${index + 1}">${item}</a>`;

      subject_select_ul.appendChild(li);
    });

  // 最初のボタンをフォーカス
  document.querySelectorAll(".thirdSection .subjectName")[0].focus();
}

// ----------------------------------------------------------------
// 科目を選択すると--------------------------------------------------
function selectedSubject(element) {
  // 選択した科目を保存
  document.getElementById("targetSubject").value = element.target.innerText;

  // ボタンを押した後の一覧を表示
  inputDisplay_controll();

  // クラス選択ボタン
  const klass_button = document.querySelectorAll(".thirdSection .klassName");

  klass_button.forEach((element) => element.addEventListener("click", create_inputed_list));
  klass_button[0].focus();
  klass_button[0].click();

  document.querySelector(".thirdSection .subjectDate").value = new Date().toLocaleDateString("sv-SE");
}

// 入力のタイトルを設定----------------------------------------------
function inputTitle() {
  // モードを取得
  const appli = document.getElementById("selectedAppli").value;
  const appli_name = appli.slice(2);

  const subject = document.getElementById("targetSubject").value;
  const klass_name = document.getElementById("Selected_Klass").value;

  document.querySelector(".inputTitle h1").innerText = `(${klass_name})${appli_name}【${subject}】`;

  // document.querySelector(".editTitle h1").innerText = `${appli_name}【${subject}】`;
}

// ボタンを押した後の表示非表示のコントロール--------------------------
function inputDisplay_controll() {
  // ボタンを非表示
  document.querySelector(".subjectSelect").style.display = "none";

  // 一覧用タイトルを表示
  document.querySelector(".inputTitle").style.display = "block";

  // クラス選択ボタンの表示
  document.querySelector(".KlassSelect").style.display = "block";

  // 新規使表示
  document.querySelector(".newAddition").style.display = "block";

  // 一覧テーブル表示
  document.querySelector(".dataTable").style.display = "block";
}

// thirdSectionの中身をリセット
function thirdSection_reset() {
  document.querySelector(".thirdSection .subjectSelect").style.display = "block";

  document.querySelector(".thirdSection .inputTitle").style.display = "none";
  document.querySelector(".thirdSection .KlassSelect").style.display = "none";
  document.querySelector(".thirdSection .newAddition").style.display = "none";
  document.querySelector(".thirdSection .dataTable").style.display = "none";
  document.querySelector(".thirdSection .editTitle").style.display = "none";
  document.querySelector(".thirdSection .actionButtons").style.display = "none";
  document.querySelector(".thirdSection .inputTable").style.display = "none";
  document.querySelector(".thirdSection .subjectDetail").style.display = "none";
  document.querySelector(".thirdSection .loader").style.display = "none";
}

// クラスを選択すると--------------------------------------------------------------------
async function create_inputed_list(e) {
  // クラス名を取得と保存
  document.getElementById("Selected_Klass").value = e.target.innerText;

  // タイトルを表示
  inputTitle();

  // リストテーブルをリセットする
  document.querySelector(".thirdSection .dataTable tbody").innerHTML = "";

  // データを取得する
  const input_table_datas = await inputed_data_check();

  // データを加工する
  const Edited_data = Edit_list_data(input_table_datas);

  // tableを作成する
  list_table_create(Edited_data);
}

// 新規追加を押すと--------------------------------------------------------------------
async function newAddition() {
  // フィールドのリセット
  document.getElementById("field_id").value = "";

  // テーブルをリセットする
  input_table_row_reset();

  // 表示非表示を切り替える
  newAddition_display();

  // タイトルを設定する
  editTitle_setting();

  // 表を作成する
  await input_table_create();

  // ヘッダーの入力を反映させる
  header_input_all();

  // 授業のタイトルをフォーカス
  document.querySelector(".regist").focus();
}

// 新規追加の表示の変更
function newAddition_display() {
  document.querySelector(".thirdSection .editTitle").style.display = "block";
  document.querySelector(".thirdSection .subjectDetail").style.display = "block";
  document.querySelector(".thirdSection .actionButtons").style.display = "block";
  document.querySelector(".thirdSection .inputTable").style.display = "block";

  document.querySelector(".thirdSection .KlassSelect").style.display = "none";
  document.querySelector(".thirdSection .inputTitle").style.display = "none";
  document.querySelector(".thirdSection .newAddition").style.display = "none";
  document.querySelector(".thirdSection .dataTable").style.display = "none";
}

// タイトルにクラス、作業、科目を表示する
function editTitle_setting() {
  // 対象クラスを取得
  const Selected_Klass = document.getElementById("Selected_Klass").value;

  // 対象の科目を取得
  const targetSubject = document.getElementById("targetSubject").value;

  // 入力対象を取得
  const selectedAppli = document.getElementById("selectedAppli").value.slice(2);

  document.querySelector(".editTitle h1").innerText = `【${Selected_Klass}】${selectedAppli}【${targetSubject}】`;
}

// 新規追加のテーブルを作成する
async function input_table_create() {
  // 対象クラスを取得
  const Selected_Klass = document.getElementById("Selected_Klass").value;
  // console.log(Selected_Klass);
  
  // 学年を取得
  const grade = document.querySelector(".displayButton").innerText;
  // console.log(grade);

  // 学生データを抽出
  const Student_List = await get_student_list(grade);
  const target_student_list = Student_List.filter((x) => x[5] == Selected_Klass);
  // console.log(target_student_list);

  const inputTable = document.querySelector(".thirdSection .inputTable tbody");

  target_student_list.forEach((student, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${student[2]}</td>
    <td><input type="text" class="studentNumber" value="${student[0]}" hidden >${student[3]}</td>
    <td><input type="checkbox" class="submission" checked></td>
    <td><input type="date" class="date" ></td>
    <td>
        <select class="pointSelect" >
           <option value=100 selected>100</option> 
        </select>
    </td>
    <td><input type="text" class="memo"></td>
    `;

    inputTable.appendChild(tr);
  });
}

// headerの内容を反映させる----------------------------------------------------------------
function header_input_all() {
  // 提出
  document.getElementById("checkAll").addEventListener("change", (e) => {
    document.querySelectorAll(".submission").forEach((element) => {
      element.checked = e.target.checked;
    });
  });

  // 日付（今日の日付）
  var today = new Date().toLocaleDateString("sv-SE");
  document.getElementById("dateAll").value = today;
  document.querySelectorAll(".date").forEach((element) => {
    element.value = today;
  });

  // 日付をまとめて反映させる
  var Target_DateAll = document.getElementById("dateAll");
  Target_DateAll.addEventListener("change", (element) => {
    document.querySelectorAll(".date").forEach((item) => {
      item.value = element.target.value;
    });
  });

  // セレクトボックスに０～99を追加する
  select_option();

  // 点数を反映させる
  const select_all = document.getElementById("selectAll");
  select_all.addEventListener("change", (e) => {
    document.querySelectorAll(".pointSelect").forEach((element) => {
      element.value = select_all.value;
    });
  });

  // 詳細を反映させる
  const memo_All = document.getElementById("memoAll");
  memo_All.addEventListener("change", (e) => {
    document.querySelectorAll(".memo").forEach((element) => {
      element.value = e.target.value;
    });
  });
}

// ninety-nine to 0
function select_option() {
  // セレクトボックスに0～99を追加する
  const subject_point = document.querySelector(".subjectPoint");
  const select_all = document.getElementById("selectAll");

  for (let index = 0; index < 100; index++) {
    const option = document.createElement("option");
    option.value = 99 - index;
    option.innerText = 99 - index;
    subject_point.appendChild(option);
  }

  for (let index = 0; index < 100; index++) {
    const option = document.createElement("option");
    option.value = 99 - index;
    option.innerText = 99 - index;
    select_all.appendChild(option);
  }

  document.querySelectorAll(".pointSelect").forEach((element) => {
    for (let index = 0; index < 100; index++) {
      const option = document.createElement("option");
      option.value = 99 - index;
      option.innerText = 99 - index;
      element.appendChild(option);
    }
  });
}

// 戻るボタンを押すと
function return_button_push() {
  // inputTableのヘッダーのリセット
  input_table_header_reset();

  // 表示の変更
  document.querySelector(".thirdSection .inputTitle").style.display = "block";
  document.querySelector(".thirdSection .inputTitle").style.display = "block";
  document.querySelector(".thirdSection .KlassSelect").style.display = "block";
  document.querySelector(".thirdSection .newAddition").style.display = "block";

  document.querySelector(".thirdSection .editTitle").style.display = "none";
  document.querySelector(".thirdSection .subjectDetail").style.display = "none";
  document.querySelector(".thirdSection .actionButtons").style.display = "none";
  document.querySelector(".thirdSection .inputTable").style.display = "none";

  // loading を表示
  document.querySelector(".thirdSection .loader").style.display = "grid";

  // 最初のクラスボタンをclick & focus
  setTimeout(() => {
    const first_klass_button = document.querySelectorAll(".thirdSection .KlassSelect a.klassName")[0];
    first_klass_button.click();
    first_klass_button.focus();

    document.querySelector(".thirdSection .loader").style.display = "none";
    document.querySelector(".thirdSection .dataTable").style.display = "block";
  }, 1000);
}

// input table headerをリセットする
function input_table_header_reset() {
  document.getElementById("checkAll").checked = true;
  document.getElementById("dateAll").value = new Date().toLocaleDateString("sv-SE");
  document.getElementById("selectAll").querySelectorAll("option")[0].selected = true;
  document.getElementById("memoAll").value = "";
}

// input table の２行目からを削除する
function input_table_row_reset() {
  //　テーブルの取得
  const input_table = document.querySelectorAll(".inputTable tbody tr");

  if (input_table.length > 1) {
    input_table.forEach((element, index) => {
      if (index > 0) {
        element.remove();
      }
    });
  }
}

// 保存ボタンを押すと
function regist_button_click() {
  // テーブルのデータを取得する
  get_input_datas();
  document.querySelector(".return").focus();
}

// テーブルのデータを取得する
async function get_input_datas() {
  // 作業、クラス、科目を取得
  const Appli = document.getElementById("selectedAppli").value;
  const Subject = document.getElementById("targetSubject").value;
  const Klass = document.getElementById("Selected_Klass").value;
  const field = document.getElementById("field_id").value;

  // 授業内容を取得
  const subject_title = document.querySelector(".subjectTitle").value;
  const subject_Date = document.querySelector(".subjectDate").value;
  const subject_Point = document.querySelector(".subjectPoint").value;
  const subject_memo = document.querySelector(".subjectMemo").value;

  // 学生の状態を取得する [クラス番号、学籍番号、名前、提出状況、日付、点数、備考]
  const student_data = input_table_student_data();

  // 保存するデータ
  const Send_Data = {
    subject_title: subject_title,
    subject_Date: subject_Date,
    subject_Point: subject_Point,
    subject_memo: subject_memo,
    student_data: JSON.stringify(student_data),
  };

  // firebase に保存
  // await set_firestore(Send_Data, Appli, Subject, Klass);
  await set_firestore2(Send_Data, Appli, Subject, Klass);
}

// 保存ボタンを押したら
async function set_firestore2(Send_Data, appli, subject, klass) {
  // firebaseのID確認
  const document_id = getDocumentID(appli, klass, subject);

  const collection_path = document_id[0][1];
  const Total_Collection = collection_path + "_Total";

  const check_id = await FireStoreApp.collection(collection_path).doc(document_id[1]).get();
  const total_data = await FireStoreApp.collection(Total_Collection).doc(document_id[1]).get();

  const total_data_obj = total_data.data();
  // console.log(check_id.exists);

  const field_id = document.getElementById("field_id");

  // documentIDが存在しなかったとき
  if (!check_id.exists) {
    const collection_path = document_id[0][1];
    const first_field = collection_path[0] + 0;
    field_id.value = first_field;
    const input_data = {
      [first_field]: JSON.stringify(Send_Data),
    };

    // 集計用のデータ作成
    const Send_Total = Edit_Total_db(Send_Data);
    const input_total = {
      [first_field]: JSON.stringify(Send_Total),
    };
    const Total_Collection = collection_path + "_Total";

    // firebaseへの新規登録
    await FireStoreApp.collection(collection_path).doc(document_id[1]).set(input_data);
    await FireStoreApp.collection(Total_Collection).doc(document_id[1]).set(input_total);
  } else {
    // console.log("更新");

    // 更新するとき
    if (field_id.value.length > 0) {
      const target_data = check_id.data();

      // 更新
      target_data[field_id.value] = JSON.stringify(Send_Data);
      // console.log(check_id);

      // 集計用のデータ作成
      const Send_Total = Edit_Total_db(Send_Data);

      total_data_obj[field_id.value] = JSON.stringify(Send_Total);

      await FireStoreApp.collection(collection_path).doc(document_id[1]).set(target_data, { marge: true });
      await FireStoreApp.collection(Total_Collection).doc(document_id[1]).set(total_data_obj, { marge: true });
    } else {
      var target_field = "";
      const target_data = check_id.data();

      // 追加用のフィールドの確認
      for (var i = 0; i < 20; i++) {
        var field_check = collection_path[0] + i;
        if (!(field_check in target_data)) {
          target_field = field_check;
          break;
        }
      }

      target_data[target_field] = JSON.stringify(Send_Data);
      console.log(target_data);

      // 集計用のデータ作成

      const Send_Total = Edit_Total_db(Send_Data);

      total_data_obj[target_field] = JSON.stringify(Send_Total);
      console.log(total_data_obj);

      console.log("追加");

      await FireStoreApp.collection(collection_path).doc(document_id[1]).set(target_data, { marge: true });
      await FireStoreApp.collection(Total_Collection).doc(document_id[1]).set(total_data_obj, { marge: true });

      document.getElementById("field_id").value = target_field;
    }
  }

  window.alert("保存しました。");
}

// テーブルから学生の状態を取得する
function input_table_student_data() {
  const Target_Table = document.querySelectorAll(".thirdSection .inputTable table tr");

  // データ返送用の配列
  var Send_Data = [];

  Target_Table.forEach((element, index) => {
    if (index > 0) {
      var student_data = element.querySelectorAll("td");

      Send_Data.push([
        student_data[0].innerText,
        student_data[1].childNodes[0].value,
        student_data[1].innerText,
        student_data[2].childNodes[0].checked,
        student_data[3].childNodes[0].value,
        student_data[4].childNodes[1].value,
        student_data[5].childNodes[0].value,
      ]);
    }
  });

  // [クラス番号、学籍番号、名前、提出状況、日付、点数、備考]
  // console.log(Send_Data);
  return Send_Data;
}

// firestore に保存する
async function set_firestore(Send_Data, Appli, Subject, Klass) {
  // CollectionNameを取得する
  const Collection_Name = apply_collect_relation.filter((x) => x[0] == Appli).map((x) => x[1]);

  // console.log(Collection_Name[0]);
  // 集計用にデータを編集する
  const Send_Total = Edit_Total_db(Send_Data);

  // idを確認する
  const firebase_ID = document.getElementById("firebase_ID").value;

  // field id
  const field_id = document.getElementById("field_id").value;

  if (firebase_ID.length > 0) {
    // 保存されているか確認をする
    const check_boolean = await check_firestore(Collection_Name[0], firebase_ID, field_id);

    if (check_boolean) {
      var result = window.confirm("再度保存しますか。");

      if (result) {
        // 管理用のデータ保存
        await FirestoreApp.collection(Collection_Name[0]).doc(Subject).collection(Klass).doc(firebase_ID).set(Send_Data);

        //  集計用のデータ保存
        await FirestoreApp.collection(Collection_Name[0] + "_Total")
          .doc(Subject)
          .collection(Klass)
          .doc(firebase_ID)
          .set({ Send_Total: JSON.stringify(Send_Total) });

        // リスト一覧に戻る
        return_button_push();
      }
    } else {
      var result = window.confirm("保存しますか。");

      if (result) {
        // 管理用の新規データ
        const Save_Data = await FirestoreApp.collection(Collection_Name[0]).doc(Subject).collection(Klass).add(Send_Data);
        // 集計用の新規データ
        await FirestoreApp.collection(Collection_Name[0] + "_Total")
          .doc(Subject)
          .collection(Klass)
          .add({ Send_Total: JSON.stringify(Send_Total) });

        // IDを保存
        document.getElementById("firebase_ID").value = Save_Data.id;

        // リスト一覧に戻る
        return_button_push();
      }
    }
  } else {
    var result = window.confirm("保存しますか。");

    if (result) {
      // 管理用の新規データ
      const Save_Data = await FirestoreApp.collection(Collection_Name[0]).doc(Subject).collection(Klass).add(Send_Data);

      // 集計用の新規データ
      await FirestoreApp.collection(Collection_Name[0] + "_Total")
        .doc(Subject)
        .collection(Klass)
        .add({ Send_Total: JSON.stringify(Send_Total) });

      document.getElementById("firebase_ID").value = Save_Data.id;
      // リスト一覧に戻る
      return_button_push();
    }
  }
}

// firestoreにあるか確認する
async function check_firestore(Appli, firebase_ID, field_id) {
  const target_data = await FirestoreApp.collection(Appli).doc(firebase_ID).get();
  console.log(target_data);
  return target_data.exists;
}

// 入力済みのデータIDを確認する------------------------------------------------------------------------
async function inputed_data_check() {
  // 作業内容、科目、クラスを取得
  const selectedAppli = document.getElementById("selectedAppli").value;
  const targetSubject = document.getElementById("targetSubject").value;
  const Selected_Klass = document.getElementById("Selected_Klass").value;
  // console.log(selectedAppli);
  // console.log(targetSubject);
  // console.log(Selected_Klass);

  // 作業内容
  const Collection_Name = apply_collect_relation.filter((x) => x[0] == selectedAppli).map((x) => x[1]);

  // 必要なIDを取得する
  const document_id = getDocumentID(selectedAppli, Selected_Klass, targetSubject);
  // console.log(document_id);
  
  const collection_path = document_id[0][1];
  const document_path = document_id[1];

  var Send_Data = [];

  const target_datas = await FireStoreApp.collection(collection_path).doc(document_path).get();
  // console.log(target_datas.exists);

  if (!target_datas.exists) {
    // データが無いとき
    window.alert("データがありません。新規作成してください。");
    const newAddition_btn = document.querySelector(".thirdSection .newAddition");
    newAddition_btn.childNodes[1].focus();
    // console.log(newAddition_btn.childNodes[1]);
  } else {
    // データがあるとき
    const target_data = target_datas.data();

    for (var i = 0; i < 10; i++) {
      const field_id = collection_path[0] + i;

      if (field_id in target_data) {
        const edit_data = JSON.parse(target_data[field_id]);
        // console.log(edit_data);
        Send_Data.push([
          field_id,
          target_datas.id,
          edit_data.subject_title,
          new Date(edit_data.subject_Date),
          JSON.parse(edit_data.student_data),
        ]);
      }
    }
  }

  // console.log(Send_Data);
  return Send_Data;
}

// 取り出したデータを加工する
function Edit_list_data(data) {
  // 日付の遅い順に並べ替え
  const sorted_data = data.sort((a, b) => b[3] - a[3]);
  // console.log(data);

  // テーブルに入れられるよう加工する
  var Send_Data = [];

  sorted_data.forEach((element, index) => {
    // 日付を変換する
    var Month = element[3].getMonth() + 1;
    var Day = element[3].getDate();

    if (index == 0) {
      // [No、名前、[ID、タイトル、日付]]
      Send_Data.push(["No", "名前", [element[1], element[2], Month + "/" + Day, element[0]]]);

      // [C番号、[学籍番号、名前]、点数]
      element[4].forEach((item, num) => {
        Send_Data.push([item[0], [item[1], item[2]], item[5]]);
      });
    } else {
      // [ID、タイトル、日付]
      Send_Data[0].push([element[1], element[2], Month + "/" + Day, element[0]]);

      // [点数]
      element[4].forEach((item, num) => {
        Send_Data[num + 1].push(item[5]);
      });
    }
  });

  // console.log(Send_Data);
  return Send_Data;
}

// tableを作成する
function list_table_create(Edited_data) {
  const dataTable = document.querySelector(".dataTable table tbody");

  Edited_data.forEach((element, index) => {
    var tr = document.createElement("tr");

    // テーブルヘッダーの作成
    if (index == 0) {
      element.forEach((item, num) => {
        var th = document.createElement("th");
        if (num > 1) {
          var a = document.createElement("a");
          a.classList = "edit_link";
          a.href = "#";
          a.innerHTML = `${item[1].substring(0, 4)}<br>${item[2]}
                        <input type="text" value=${item[0]} hidden/>
                        <input type = "text" class="field_id" value=${item[3]} hidden/>
                        <div class="balloon"><p>${item[1]}</p></div>`;
          th.appendChild(a);
          tr.appendChild(th);
        } else {
          th.innerText = item;
          tr.appendChild(th);
        }
      });
      dataTable.appendChild(tr);
    } else {
      // テーブルデータの作成
      element.forEach((item, num) => {
        var td = document.createElement("td");
        if (num == 0) {
          td.innerText = item;
          tr.appendChild(td);
        } else if (num == 1) {
          td.innerHTML = `<input type="text" value= ${item[0]} hidden /> ${item[1]}`;
          tr.appendChild(td);
        } else {
          td.innerText = item;
          tr.appendChild(td);
        }
      });
      dataTable.appendChild(tr);
    }
  });

  document.querySelectorAll(".edit_link").forEach((element) => {
    element.addEventListener("click", edit_link);
  });
}

// edit_link をクリックして編集画面を表示する---------------------------------------
async function edit_link(e) {
  const field_id = e.target.childNodes[5].value;
  // console.log(e.target.childNodes[5].value);

  // 編集ターゲットのID
  const target_ID = e.target.querySelector("input").value;

  // 作業内容、科目、クラスを取得
  const selectedAppli = document.getElementById("selectedAppli").value;
  const targetSubject = document.getElementById("targetSubject").value;
  const Selected_Klass = document.getElementById("Selected_Klass").value;

  // 作業内容
  const Collection_Name = apply_collect_relation.filter((x) => x[0] == selectedAppli).map((x) => x[1]);

  // IDを保存しておく
  document.getElementById("firebase_ID").value = target_ID;

  //新規作成と同じ動き
  newAddition();

  // field id も保存しておく
  document.getElementById("field_id").value = field_id;
  console.log(field_id);

  // firebase からデータを拾ってくる
  var edit_target_data = await FireStoreApp.collection(Collection_Name[0]).doc(target_ID).get();

  // console.log(JSON.parse(edit_target_data.data()[field_id]));
  input_table_edit(JSON.parse(edit_target_data.data()[field_id]));
}

// 編集データを表などにいれていくぅ
function input_table_edit(data) {
  document.querySelector(".subjectTitle").value = data.subject_title;
  document.querySelector(".subjectDate").value = data.subject_Date;
  document.querySelector(".subjectMemo").value = data.subject_memo;

  // 点数の部分を入れる
  document.querySelectorAll(".subjectPoint option").forEach((elemet) => {
    if (elemet.value == data.subject_Point) {
      elemet.selected = true;
    }
  });

  // 学生のデータ
  const student_data = JSON.parse(data.student_data);
  // console.log(student_data);

  // 学生の表にデータをいれていくぅ
  const Student_tr = document.querySelectorAll(".thirdSection .inputTable tr");

  Student_tr.forEach((element, index) => {
    if (index > 0) {
      var target_node = element.querySelectorAll("td");

      target_node[0].innerText = student_data[index - 1][0];
      target_node[1].innerHTML = `<input type="text" class="studentNumber" value="${student_data[index - 1][1]}" hidden >${
        student_data[index - 1][2]
      }`;
      target_node[2].querySelector("input").checked = student_data[index - 1][3];
      target_node[3].querySelector("input").value = student_data[index - 1][4];
      target_node[4].querySelectorAll("option").forEach((item, num) => {
        if (item.value == student_data[index - 1][5]) {
          item.selected = true;
        }
      });
      target_node[5].querySelector("input").value = student_data[index - 1][6];
    }
  });
}

// 得点率を出すためのデータベース用の編集---------------------------------------
function Edit_Total_db(Send_Data) {
  // console.log(Send_Data);
  const Total_Point = Send_Data.subject_Point;
  const student = JSON.parse(Send_Data.student_data);
  const reply_data = student.map((x) => [x[0], x[1], x[2], Number(x[5]), Number(Total_Point)]);
  return reply_data;
}

// Delete Button--------------------------------------------------------------
async function Delete_button_click(e) {
  // console.log(e.target);
  // 編集ターゲットのID
  const target_ID = document.getElementById("firebase_ID").value;

  // 作業内容、科目、クラスを取得
  const selectedAppli = document.getElementById("selectedAppli").value;
  const targetSubject = document.getElementById("targetSubject").value;
  const Selected_Klass = document.getElementById("Selected_Klass").value;
  const field_id = document.getElementById("field_id").value;

  // CollectionNameを取得する
  const Collection_Name = apply_collect_relation.filter((x) => x[0] == selectedAppli).map((x) => x[1])[0];

  const result = window.confirm("削除しますか？");

  if (result) {
    if (target_ID.length > 0) {
      // 管理用の削除
      const target_obj = await FireStoreApp.collection(Collection_Name).doc(target_ID).get();
      const target_data = target_obj.data();
      delete target_data[field_id];
      await FireStoreApp.collection(Collection_Name).doc(target_ID).set(target_data);

      // 集計用の削除
      const collection_path = Collection_Name + "_Total";
      const total_obj = await FireStoreApp.collection(collection_path).doc(target_ID).get();
      const total_data = total_obj.data();
      delete total_data[field_id];
      await FireStoreApp.collection(collection_path).doc(target_ID).set(total_data);
    }
    // リスト一覧に戻る
    return_button_push();
  }
}
