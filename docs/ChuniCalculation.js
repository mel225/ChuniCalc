(function() {
  console.log("========== ChuniCalculation.js begin ==========");
  console.log("-- Projected by mel225 (github, Twitter:@casge_pzl)");

  alert("選択した値を、ほかの値によって計算します。");

  var maxChainData; // 
  var musicBoxes; // ページ上の各難易度のBOXをelementで保持する
  
  /* 外部ファイルの読み込み */
  new Promise(function(resolve, reject){ // 時間がかかるのでプロミスにする。
    var files = ["MusicData.js", "readFile.js"];
    var index = 0;
    var pro = function(resolve, reject){
      if(index >= files.length){
        return resolve();
      }
      var script = readOuterJs(files[index]);
      script.onload = function(){
        index++;
        resolve(new Promise(pro));
      };
    };
    resolve(new Promise(pro));
  }).then(function(){
    setContentsCSS();
    console.log("setContentsCSS()");

    getDataByPage();
    console.log("getDataByPage()");

    maxChainData = getMaxChainByFile();
    console.log("getMaxChainByFile()");
  }).then(function(){
    /* 各難易度のBOXに対して処理を行う */
    for(var i=1; i<=4; i++){
      var dataBox = dataBoxes.getData(i);
      if(dataBox != undefined){
        var difficulty = dataBoxes.getDifficultyString(i);
        addCalcDiv(dataBox, difficulty);
        setScorePoint(dataBox, difficulty);
        initCalcDiv(dataBox, difficulty);
      }
    }
  }).then(function(){
    console.log("execute initCalcDiv()");
    for(var i=1; i<=4; i++){
      var dataBox = dataBoxes.getData(i);
      if(dataBox !
    }
    initCalcDiv();
    console.log("initCalcDiv()");
    
    alert("すべての設定が完了しました。");
  });
  
  /* それぞれのDivを乗せるBOXをデータとして取得 */
  function getDataByPage(){
    musicboxes = document.getElementsByClassName("w420 music_box");
    musicBoxes = new MusicData(getTitle());
    var difficulty;
    for(var i=1; i<=4; i++){
      difficulty = musicBoxes.getDifficultyString(i);
      [].forEach.call(musicboxes, function(musicbox){
        if(musicbox.className.indexOf(difficulty) != -1){ // 難易度文字列が見つかった時データとして追加
          musicBoxes.setData(i, musicbox);
        }
      });
    }
  };
  
  /* BOXデータにDivを追加する */
  function addCalcDiv(box, difficulty){
    
    /* それぞれのプロパティを設定 */
    var scoreDiv = document.createElement("div"); // SCORE 数値枠
    var notesDiv = document.createElement("div"); // 各判定の数値枠の親
    var buttonDiv = document.createElement("div"); // 計算ボタン枠
    var maxChain = document.createElement("span"); // ノーツ数表示枠

    var justiceDiv = document.createElement("div"); // justice 数値枠
    var attackDiv = document.createElement("div"); // attack 数値枠
    var missDiv = document.createElement("div"); // miss 数値枠
    
    scoreDiv.className = "block_underline ptb_5";
    notesDiv.className = "block_underline ptb_5";
    buttonDiv.className = "block_underline ptb_5";
    maxChain.className = "ml_10 mb-10 font_90 maxChain bg_" + difficulty;
    
    scoreDiv.id = "scoreDiv_" + difficulty;
    notesDiv.id = "notesDiv_" + difficulty;
    buttonDiv.id = "buttonDiv_" + difficulty;
    maxChain.id = "maxChain_" + difficulty;
    justiceDiv.id = "justiceDiv_" + difficulty;
    attackDiv.id = "attackDiv_" + difficulty;
    missDiv.id = "missDiv_" + difficulty;

    /* BOXデータ内のdataBoxを取得し、そこにDivを追加していく */
    var dataBox = box.getElementsByClassName("box02 w400")[0];
    var scoreBox = dataBox.firstElementChild;
    musicBox.insertBefore(scoreDiv, dataBox.lastElementChild);
    musicBox.insertBefore(notesDiv, dataBox.lastElementChild);
    musicBox.insertBefore(buttonDiv, dataBox.lastElementChild);
    scoreBox.appendChild(maxChain);
    
    /* innerHTML, innerText */
    scoreDiv.innerHTML = '' + 
      '<input type="radio" name="radio_'+difficulty+'" value="score">' + 
        '<input type="text" style="width:150px;" id="score_'+difficulty+'" class="ml_10">' +
          '<span class=ml_10">(SCORE)</span>';
    justiceDiv.innerHTML = '' +
      '<input type="radio" name="radio_'+difficulty+'" checked="checked" value="justice" >'+
        '<input type="text" style="width:80px;" id="justice_'+difficulty+'" class="ml_10">' +
          '<span class="ml_10">JUSTICE</span>';
    attackDiv.innerHTML = '' +
      '<input type="radio" name="radio_'+difficulty+'" value="attack">' +
        '<input type="text" style="width:80px;" id="attack_'+difficulty+'" class="ml_10">' +
          '<span class="ml_10">ATTACK</span>';
    missDiv.innerHTML = '' + 
      '<input type="radio" name="radio_'+difficulty+'" value="miss">' +
        '<input type="text"  style="width:80px;" id="miss_'+difficulty+'" class="ml_10">' + 
          '<span class="ml_10">MISS</span>';
    maxChain.innerText = 'MaxChain: ';
    maxChain.value = "";
    notesDiv.appendChild(justiceDiv);
    notesDiv.appendChild(attackDiv);
    notesDiv.appendChild(missDiv);

    /* buttonDiv に乗せるボタンの設定 */
    var calcButton = document.createElement('div');
    calcButton.className = "btn_calc";
    calcButton.addEventListener("click", calculate);
    calcButton.innerText = "計算";
    calcButton.value = difficulty;
    buttonDiv.appendChild(calcButton);

    /* 表示/非表示ボタンを付けて織り込めるようにする */
    var showButton = document.createElement('div');
    showButton.className = "btn_show";
    showButton.addEventListener("click", show_hide);
    showButton.innerText = "hide";
    showButton.value = "showing";
    showButton.id = "showhide_" + difficulty;
    databox.insertBefore(showButton, databox.firstElementChild);
    function show_hide(){
      if(showButton.value == "showing"){
        for(i=3; i<databox.children.length; i++){
          databox.children[i].style.display = "none";
        }
        showButton.value = "hiding";
        showButton.innerText = "show";
      }else{
        for(i=3; i<databox.children.length; i++){
          databox.children[i].style.display = "block";
        }
        showButton.value = "showing";
        showButton.innerText = "hide";
      }
    }
  };
  
  /* setting of contents.css in this repositry */
  function setContentsCSS(){
    var link_tag = document.createElement('link');
    link_tag.rel = "stylesheet";
    link_tag.href = "https://mel225.github.io/ChuniCalc/contents.css";
    document.getElementsByTagName('head')[0].appendChild(link_tag);
  };

  /* スコアの値をdocumentから探してコピーする */
  function setScorePoint(box, difficulty) {
    /* スコア枠にあるinputタグ(テキストフィールド) */
    var scoreInput = box.getElementById("score_" + difficulty);
      
    /* ページ上のハイスコアが記載されたelement */
    var highScoreDiv = box.getElementsByClassName("text_b")[0];

    /* ハイスコアを数値文字列で取得 */
    var highScore = getNum(highScoreDiv.textContent);

    /* テキストフィールドに値を設定 */
    scoreInput.value = highScore;
  }

  /* 開いているページの曲のタイトルを取得する */
  function getTitleByPage(){
    return document.getElementsByClassName('play_musicdata_title')[0].innerText;
  }
  
  /* MaxChain 数（ノーツ数）をファイルから取得する */
  function getMaxChainByFile(){
    var title = musicBoxes.getTitle();
    return readText(openFile()).then(function(musics){
      if(musics[title] == undefined){
        alert(title + " のデータが見つかりませんでした。");
        return Promise.reject();
      }else{
        maxChainData = musics[title];
        return;
      }
    });
  }

  function setMaxChain(){
    var music = musics[title];
        for(i=1; i<=4; i++){
          var diff = music.getDifficultyString(i);
          var maxChain = document.getElementById('maxChain_' + diff);
          if(maxChain != undefined){ // データがない難易度には何もしない。
            var notes = music.getData(i);
            var n = Number(notes);
            maxChain.innerText += notes;
            maxChain.value = notes;
            
            /* 減分の表示 */
            var justiceDif = document.createElement("span");
            var attackDif = document.createElement("span");
            var missDif = document.createElement("span");
            
            justiceDif.className = "ml_10 text_red";
            attackDif.className = "ml_10 text_red";
            missDif.className = "ml_10 text_red";
            
            justiceDif.innerText = "(-" + parseInt(10000/n) + ")";
            attackDif.innerText = "(-" + parseInt(510000/n) + ")";
            missDif.innerText = "(-" + parseInt(1010000/n) + ")";
            
            document.getElementById('justiceDiv_' + diff).appendChild(justiceDif);
            document.getElementById('attackDiv_' + diff).appendChild(attackDif);
            document.getElementById('missDiv_' + diff).appendChild(missDif);
          }
        }
      }
      return;
    });
  }

  /* 入力欄を初期化する */
  function initCalcDiv(box, difficulty){
    box.getElementById("justice_" + difficulty).value = "0";
    box.getElementById("attack_" + difficulty).value = "0";
    box.getElementById("miss_" + difficulty).value = "0";
    calculate(difficulty, true); // true: 非表示
  }

  /* 外部ファイルをファイル名から読み込む */
  function readOuterJs(filename){
    var id = "mel225_" + filename;
    var s;
    if(document.getElementById(id) == undefined){
      s = document.createElement('script');
      s.src = "https://mel225.github.io/ChuniCalc/" + filename;
      s.id = id;
      document.getElementsByTagName('head')[0].appendChild(s);
    }
    return s;
  };

  /* 入力された数値をもとに計算を行う */
  function calculate(element, isDisp = true){ // isDisp = true:アラートする false:しない
    var difficulty;
    var variable = "";
    var radioGroup;
    var div_s;
    var div_j;
    var div_a;
    var div_m;
    var score = 0;
    var justice = 0;
    var attack = 0;
    var miss = 0;
    var n = 0;

    /* 難易度を取得する */
    if((typeof element) == "string"){
      var difficulty = element;
    }else{ // ボタンの clickEvent に関数を登録すると第一引数に MouseEventObject が渡される
      // この場合は this がボタン本体を示す
      var difficulty = this.value;
    }

    /* ラジオボタンからどの値を計算するのかを探す */
    radioGroup = document.getElementsByName("radio_"+difficulty);
    radioGroup.forEach(function(item){
      if(item.checked){
        variable = item.value;
      }
    });

    /* 入力欄に入力された値を取得する */
    div_s = document.getElementById("score_" + difficulty);
    score = parseInt(getNum(div_s.value), 10);
    div_j = document.getElementById("justice_" + difficulty);
    justice = parseInt(getNum(div_j.value), 10);
    div_a = document.getElementById("attack_" + difficulty);
    attack = parseInt(getNum(div_a.value), 10);
    div_m = document.getElementById("miss_" + difficulty);
    miss = parseInt(getNum(div_m.value), 10);

    /* ノーツ数を取得する */
    n = parseInt(document.getElementById("maxChain_" + difficulty).value, 10);

    /* 取得した数値をコンソールで確認する */
    console.log("score: " + score,
                "justice: " + justice,
                "attack: " + attack,
                "miss: " + miss,
                "notes: " + n
                );
    
    /* 取得した値が数値変換後の値なのでその値に変える */
    div_s.value = String(score);
    div_j.value = String(justice);
    div_a.value = String(attack);
    div_m.value = String(miss);
    
    /* 計算を行い、フォームに値をセットし、アラートする */
    switch(variable){
    case "score":
      score = parseInt(1010000 - (justice + 51 * attack + 101 * miss) * 10000 / n, 10);
      if(isDisp)
        alert("SCORE が [" + score + "] になりました。");
      div_s.value = String(score);
      break;
    case "justice":
      justice = parseInt(((1010000 - score) * n - 510000 * attack - 1010000 * miss) / 10000, 10);
      if(isDisp)
        alert("JUSTICE が [" + justice + "] になりました。");
      div_j.value = String(justice);
      break;
    case "attack":
      var old_justice = justice;
      attack = parseInt(((1010000 - score) * n - 10000 * justice - 1010000 * miss) / 510000, 10);
      justice = parseInt(((1010000 - score) * n - 510000 * attack - 1010000 * miss) / 10000, 10);
      if(isDisp){
        if(old_justice == justice){
          alert("ATTACK が [" + attack + "] になりました。");
        }else{
          alert("ATTACK が [" + attack + "] になり、" +
                "JUSTICE が [" + old_justice + "+" + (justice - old_justice) +
                "] に補正されました。");
          div_j.value = String(old_justice) + "+" + String(justice - old_justice);
        }
      }
      div_a.value = String(attack);
      break;
    case "miss":
      var old_justice = justice;
      miss = parseInt(((1010000 - score) * n - 10000 * justice - 510000 * attack) / 1010000, 10);
      justice = parseInt(((1010000 - score) * n - 510000 * attack - 1010000 * miss) / 10000, 10);
      if(isDisp){
        if(old_justice == justice){
          alert("MISS が [" + miss + "] になりました。");
        }else{
          alert("MISS が [" + miss + "] になり、" +
                "JUSTICE が [" + old_justice + "+" + (justice - old_justice) +
                "] に補正されました。");
          div_j.value = String(old_justice) + "+" + String(justice - old_justice);
        }
      }
      div_m.value = String(miss);
      break;
    default:
      console.log("ラジオボタンの設定を見直すべきだ");
    }
  }

  /* 文字列から数字以外を削除した新たな文字列を取得 */
  function getNum(str){
    str = str.replace(/[^\+\-0-9]/g, ''); // プラス、マイナス及び数字以外の文字を消去
    str =  str.slice(0, 1) + str.slice(1).replace(/-/g, ''); // ２文字目以降のマイナス文字を消去

    var str_s = str.split('+'); // プラスで区切って足し合わせる
    var num = 0;
    for(var i=0; i<str_s.length; i++){
      num += Number(str_s[i]);
    }
    return String(num);
  }
}) ();
