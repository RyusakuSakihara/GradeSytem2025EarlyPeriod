// TempDataのまとめ --------------------------------

// クラス一覧
// Klass_List

// カリキュラム情報
// Curriculum_Datas

// 学生情報
// Students_Datas

// カリキュラムとクラスの対応表
// Relation_Klass_Curriculum

// ------------------------------------------------
window.onload = function() {

    // セレクトボックスに値を入れる
    const Input_IDs = ['Curriculum_Allocation','All_Points']
    Selectbox_Options(Input_IDs)

    // 入力表のセレクトボックスに値を入れる
    Point_Setting()


    //ヘッダーにリストを追加する
    Header_Create()
}



function Header_Create() {
    //リストに選択肢を追加する
    First_List_Create()

    //２段目のリストを入れる
    Second_List_Create()

    //リストを選択すると
    List_Select()
}


function First_List_Create() {
    
    // ２出席率にクラス一覧を設定
    const Target_Nodes_One = document.querySelector('#header nav ul li:nth-child(2) ul')


    Klass_List.forEach( element => {
        const li = document.createElement('li')
        li.innerHTML = `<a href="#" >${element}</a>`
        Target_Nodes_One.appendChild(li)
    });


    //  ３授業態度、４提出物、５ミニテスト、６評価テスト　に　科目名を追加する
    Header_Curriculum_List_Add('#header nav ul li:nth-child(3) ul')
    Header_Curriculum_List_Add('#header nav ul li:nth-child(4) ul')
    Header_Curriculum_List_Add('#header nav ul li:nth-child(5) ul')
    Header_Curriculum_List_Add('#header nav ul li:nth-child(6) ul')
    Header_Curriculum_List_Add('#header nav ul li:nth-child(7) ul')

}



//  ３授業態度、４提出物、５ミニテスト、６評価テスト　に　科目名を追加する
function Header_Curriculum_List_Add(Selector_Class) {

    // カリキュラム情報から大種別を一意で取り出す
    const Big_Class = Curriculum_Datas.map(x=>x[5])
    var Unique_Big_Class = []
    Big_Class.forEach(item=>{
        if (Unique_Big_Class.indexOf(item)<0&&item.length) {
            Unique_Big_Class.push(item)
        }
    })
    // console.log(Unique_Big_Class);
    
    // ヘッダーに追加する
    const Target_Nodes = document.querySelector(Selector_Class)

    Unique_Big_Class.forEach( element => {
        const li = document.createElement('li')
        li.innerHTML = `<a href="#" >${element}</a>`
        li.classList.add("has-child")
        Target_Nodes.appendChild(li)
    })
}



// ２段目の選択肢の作成
function Second_List_Create() {
    
    Header_Second_List('#header nav ul li:nth-child(3) ul li')
    Header_Second_List('#header nav ul li:nth-child(4) ul li')
    Header_Second_List('#header nav ul li:nth-child(5) ul li')
    Header_Second_List('#header nav ul li:nth-child(6) ul li')
    Header_Second_List('#header nav ul li:nth-child(7) ul li')
}



// ２段目に追加する
function  Header_Second_List(Selector_Class) {

    const Target_Nodes = document.querySelectorAll(Selector_Class)

    // console.log(Target_Nodes);
    
    Target_Nodes.forEach(element => {
        Middle_Class_Create(element)
    });

}


//　科目名を取得
function Middle_Class_Create(item) {
    
    const Big_Class_Name = item.childNodes[0].text
    const Middle_Class_Names = Curriculum_Datas.filter(x=> x[5] == Big_Class_Name)

    const Unique_Array = Unique_Middle_Class(Middle_Class_Names.map(x=>x[4]))

    const ul = document.createElement('ul')
    
    Unique_Array.forEach(element=>{
        const li = document.createElement("li")
        li.innerHTML = `<a href="#" class="Middle_Class">${element}</a>`
        ul.appendChild(li)
    })

    item.appendChild(ul)

// console.log(Unique_Array);
}


//一次元配列を一意の値にする
function  Unique_Middle_Class(params) {

    var Unique_Array = []

    params.forEach(item=>{
        if (Unique_Array.indexOf(item)<0) {
            Unique_Array.push(item)
        }
    })

    return Unique_Array
}


//リストを選択する
function List_Select() {
    console.log("aiueo");

    document.querySelectorAll('.Header_Navi').forEach( element => {
        element.childNodes[0].addEventListener('mouseover',System_Temp_Text)
    })
}

// テキストボックスに入れる
function System_Temp_Text() {
    document.getElementById('Navi_text').value = this.textContent
}