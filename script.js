// JSONファイルのパス　今後建設予定
//const filePath_array=['./JSON/ca.json','./JSON/mock1.json'];

//JSONのパス現在はこちらがメイン
const jsonFilePath = './JSON/ca.json';
const SVGelement = document.getElementById("SVGViewer");
let Random_flag = false; // もしくは false

// チェックボックスの要素を取得
let checkbox = document.getElementById('myCheckbox');
//制限時間や枚数の変数
let timer
let count
let miss_key= {
furigana:0,
namae: 0,
postal_code:0,
address: 0,
phone:0,
email:0,
question1:0,
question2: 0,
question3:0}
let FormData_key={
    no:"",
    furigana:"",
    namae:"",
    postal_code:"",
    address:"",
    phone:"",
    question1:"",
    question2:"",
    question3:""}

// JSONファイルを取得し変数に代入する関数
async function fetchAndAssignJSONFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON file: ${filePath}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// JSONファイルを取得し、グローバル変数に代入する
fetchAndAssignJSONFile(jsonFilePath)
    .then(data => {
        ans = data;
        console.log(ans);
    })
    .catch(error => console.error('Failed to fetch data:', error));

//入力訓練データとして格納した配列をシャッフルする
function arrayShuffle(array) {
    //arrayが深い処理になっているので、浅いコピーにしている
    Shuffletmp=[...array];
    for(let i = (Shuffletmp.length - 1); 0 < i; i--){     
        // 0〜(i+1)の範囲で値を取得
        let r = Math.floor(Math.random() * (i+1));
        // 要素の並び替えを実行
        let tmp = Shuffletmp[i];
        Shuffletmp[i] = Shuffletmp[r];
        Shuffletmp[r] = tmp;
        }
    return Shuffletmp;
      }
// 変数の値に応じてチェックボックスの状態を制御
// チェックボックスの状態が変更された場合、変数の値も更新する
checkbox.addEventListener('change', function() {
    Random_flag = checkbox.checked;
    console.log(Random_flag)
    console.log(ans)
});

function endMove(){
        //、ここに追加の処理を記述
        clearInterval(timer);
        $('#count').text("アンケート入力フォーム")
        for(key in FormData_key){
            let tmp="#"+key
            console.log(tmp)
            $("label[for='" + key + "']").css("border", "none");
            $(tmp).val("");
        }

        alert(count+'枚完了')
        $('#surveyForm').hide();
        $('#SVGContainer').hide()
        $('#remainingTime').hide();
        $("#kekka").show();
        resulet_key={
            furigana: "ふりがな",
            namae: "名前",
            postal_code: "郵便番号",
            address: "住所",
            phone: "電話番号",
            email: "メールアドレス",
            question1: "問1",
            question2: "問2",
            question3: "問3",
            }

        var outputDiv = document.getElementById("kekka");
        html=""
        html='<h1>結果発表</h1><h2>枚数: ' + count + '枚</h2>'
        for(key in miss_key){
            if(miss_key[key]>0){
                console.log(miss_key)
                html+="<p>" + resulet_key[key]+":"+miss_key[key]+ '箇所</p>'
            }
        }
        html+='<button onclick="kekkahidden()" id="kekka1" class="btn btn-primary mt-3">戻る</button>'
        
        outputDiv.innerHTML = html;
        console.log(outputDiv.innerHTML)
        miss_key= {
            furigana:0,
            namae: 0,
            postal_code:0,
            address: 0,
            phone:0,
            email:0,
            question1:0,
            question2:0,
            question3:0}
            count=0
            Random_flag=false
        }

function question_Draw(ans_table){
        
        //SVGの描画
        SVGsrc="./SVG/consatosvg/"+ans_table["filename"];
        SVGelement.src=SVGsrc;
        //問題のナンバー        
        $("#no1").text("No:"+ans_table["no"]).css("font-size", "18px");
        console.log(ans_table["no"])
        console.log(SVGsrc)
    //jsonで答えのないデータ=設問していない箇所を検知する
    for(key in ans_table){
        if(ans_table[key]==""){
            tmp="#"+key+"-content"
            $(tmp).hide()
            }else{
            tmp="#"+key+"-content"
            $(tmp).show()
        }
    }
}
$(document).ready(function() {
        $('#timeForm').submit(function(event) {
            count=0
            console.log("チェックフラグ",Random_flag)   
            $('#remainingTime').show()
            event.preventDefault();
            var inputTimeMinute = parseInt($('#timeInputMinute').val());
            var inputTime = inputTimeMinute * 60; // 入力時間を秒に変換
            if(Random_flag){
                for(let i=0; i<ans.length; i++){
                    ans_result=arrayShuffle(ans)
                    console.log("シャッフル：",ans_result)
             }
            }else{
                ans_result=ans
            }
            console.log("ANS_table.len:"+ans_result.length)
            ans_table=ans_result[count]
            question_Draw(ans_table)
            if (inputTime > 0) {
                // 入力可能な時間が設定された場合、スタート画面を非表示にしてデータ入力フォームを表示
                $('#surveyForm').show();
                $('#timeForm').hide();
                $('#SVGContainer').show() 
                // 残り時間を表示する
                var remainingTime = inputTime;
                $('#remainingTime').text('残り時間：' + Math.floor(remainingTime / 60) + '分' + remainingTime % 60 + '秒').css("font-size","18px");         
                // 残り時間を更新する関数を定義し、1秒ごとに実行する
                timer = setInterval(function() {
                    remainingTime--;
                    $('#remainingTime').text('残り時間：' + Math.floor(remainingTime / 60) + '分' + remainingTime % 60 + '秒');
                    if (remainingTime <= 0) {
                        endMove()
                    }
                }, 1000); // 1秒ごとに更新
            } else {
                alert('入力可能な時間を正しく設定してください。');
            }
        });
    });

function kekkahidden(){
        console.log("押した")
        $("#timeForm").show()
        $("#kekka").hide()
}
function check(ans_key,FormData_key,){
    for(var key in ans_key){
        if(key=="filename")continue
        if(FormData_key[key]=="" || FormData_key==undefined || FormData_key==null){
            return false
        }
    }
    let flag=true
    for (var key in ans_key) {
        if (ans_key[key] !== FormData_key[key]) {
           // $("#" + key).css("border", "3px groove red");
            $("label[for='" + key + "']").css("border-bottom", "3px groove red");
            console.log(key)
            miss_key[key]=miss_key[key]+1
            flag=false
        } else {   
            $("label[for='" + key + "']").css("border", "none");
        }
    }
    return flag    
}
function stop(){
    endMove()
}

$(document).ready(function() {  $("#surveyForm").submit(function(event) {
        // フォームの送信をキャンセル
        event.preventDefault();
        // 入力された値の辞書
        FormData_key={
                no:"",
                furigana:"",
                namae:"",
                postal_code:"",
                phone:"",
                address:"",
                question1:"",
                question2:"",
                question3:""}
            //入力を受け取る   
            ans_len=0;
            for(key in ans_table){
                if(ans_table[key]==""){
                   FormData_key[key]=ans_table[key]
                   console.log(key)
                }
                else if(key=="no"){
                    FormData_key[key] = ans_table["no"];
                }
                else if(key=="question2" || key=="question3"){
                    ktmp="input[name='"+key+"']:checked"
                    FormData_key[key]=$(ktmp).val();    
                }else{
                    let key_tmp="#"+key
                    FormData_key[key]=$(key_tmp).val()
                }
                }
        console.log("入力のデータ",FormData_key,"anslen",ans_len);
        ans_key={
            no:"",
            furigana:"",
            namae:"",
            postal_code:"",
            address:"",
            phone:"",
            email:"",
            question1:"",
            question2:"",
            question3:""}
        for(key in ans_table){
            if(key !=="filename"){ans_key[key]=ans_table[key];}
            //console.log(key)
        }
        console.log("答えのデータ",ans_table)
        
        //答えのロジック
        if(check(ans_key,FormData_key)){
            count+=1
            console.log("count:"+count)
            //上限の数を超えると配列の外にでるのでmodをかける
            ans_table=ans_result[count%ans_result.length]
            SVGpath="./SVG/"+ans_table["filename"];
            SVGelement.src=SVGpath;
            $('#count').text("アンケート入力フォーム 現在："+count+"枚目")
            for(key in FormData_key){
                let tmp="#"+key
                console.log(tmp)
                $(tmp).val("");
            }
            question_Draw(ans_table)
        }
        console.log(ans_key)        
    });
});
