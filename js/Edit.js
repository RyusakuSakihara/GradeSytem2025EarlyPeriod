//クラスを選択
function Choose_Class() {
    //文字だけを取得
    const Target_Text = this.innerText.slice(this.innerText.indexOf('.')+1);
    const Target_Class = Target_Text;
    document.getElementById('Target_Class').value=Target_Text;


    //選択したクラス以外を非表示にする
    const Target_Table = document.querySelector('div.three section table tbody')
    Target_Table.childNodes.forEach((element,index)=>{

        if (index>1) {
            if (element.childNodes[1].childNodes[0].value==Target_Class) {
                //行の表示
                display_control(element,'table-row')
                //チェックボックスを入れる
                checked_control(element.childNodes[0].childNodes[0],true)
            }else{
                //行の非表示
                display_control(element,'none')
                //チェックボックスを外す
                checked_control(element.childNodes[0].childNodes[0],false)
            }    
        }

    })

    //最初のチェックボックスを選択
    document.getElementById('checkboxAll').focus()
}


//アクションボタンの設定
function Button_Action() {
    // console.log('アクション')
    //ボタンの文字を取得
    const Action_Name = this.innerText.slice(2);
    // console.log(Action_Name);

    switch (Action_Name) {
        case "保存":
            Enter_Register()//保存ボタンを押すと
            break;

        case "戻る":
            Trun_Back()//戻るボタンを押すと
            break;

        case "削除":
            console.log("削除だよ");
            break;

        default:
            break;
    }

}


//戻るボタン
function Trun_Back() {
    
    //一度、コンテンツを非表示にする
    reset()

    //チェックボックスとテキストボックスをリセットする
    const Enter_Checkboxes = document.querySelectorAll('.enter_checkbox')
    Enter_Checkboxes.forEach((element)=>{
        element.checked=true

        //色もリセットする
       const Target_Node = element.parentNode.parentNode
       if (Target_Node.rowIndex%2==1) {
            Target_Node.style.backgroundColor = '#43519f'
       } else {
            Target_Node.style.backgroundColor = '#ff980017'
       }
    })


    //テキストボックスの値を全てリセットする
    const enter_notes = document.querySelectorAll(".enter_note")
    enter_notes.forEach((element)=>{
        element.value=""
    })

    //テーブルのヘッダーの備考をリセット
    document.getElementById('noteAll').value=''

    //職種のボタンを表示
    const Div_Two = document.querySelector('.two')
    Div_Two.style.display = "block"

    //最初のボタンをフォーカス
    const First_Button = document.querySelectorAll('div.two .btn_03')
    First_Button[0].focus();
}



//保存ボタン
function Enter_Register() {
    console.log("保存だよ");
}