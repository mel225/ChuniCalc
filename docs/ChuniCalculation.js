(function() {
  /*=*=*=*=*=*=*=*=*=*= 以下 main 処理 =*=*=*=*=*=*=*=*=*=*/
  
  console.log("========== ChuniCalculation.js begin ==========");
  console.log("-- Projected by mel225 (github, Twitter:@casge_pzl)");

  alert("選択した値を、ほかの値によって計算します。");

  var maxChainData; // 各難易度のmaxChainを保持する
  var musicBoxes; // ページ上の各難易度のBOXをelementで保持する
  
  /* 外部 js ファイルの読み込み */
  var  files = ["MusicData.js", "readFile.js"];
  Promise.all(files.map(function(filename){ // 時間がかかるのでプロミスにする。
    return new Promise(function(resolve, reject){
      var script = readOuterJs(filename); // script を追加する
      script.onload = function(){
        console.log("loaded: " + filename);
        resolve();
      }
    });
  })).then(function(){
  /* 続けて、各種データの読み込み */
    var funcs = [setContentsCSS(), // css を設定
                 getDataByPage(), // ページ上の BOX データを取得
                 getMaxChainByFile() // MaxChain をテキストファイルから取得
                 ];
    return Promise.all(funcs).then(function(){
      return Promise.resolve();
    });
  }).then(function(){
    console.log("after: " + maxChainData);
    /* 各難易度のBOXに対して処理を行う */
    for(var i=1; i<=4; i++){
      var musicBox = musicBoxes.getData(i);
      if(musicBox != undefined){
        addCalcDiv(musicBox, i); // 計算に必要な要素をページに追加する
        setScorePoint(musicBox, i); // スコアをページ上に設定する
        setMaxChain(musicBox, i); // MaxChainをページ上に設定する
        initCalcDiv(musicBox, i); // スコア以外の値を初期化する
      }
      console.log("finished to set in " + new MusicData().getDifficultyString(i));
    }
    return;
  }).then(function(){
    alert("すべての設定が完了しました。");
  });

  /*=*=*=*=*=*=*=*=*=*= 以上 main 処理 =*=*=*=*=*=*=*=*=*=*/

  /*=*=*=*=*=*=*=*=*=*= 以下 各種読み込みメソッド =*=*=*=*=*=*=*=*=*=*/
  
  /* それぞれのDivを乗せるBOXをデータとして取得 */
  function getDataByPage(){
    return new Promise(function(resolve, reject){
      musicboxes = document.getElementsByClassName("w420 music_box");
      musicBoxes = new MusicData(getTitleByPage());
      var difficulty;
      for(var i=1; i<=4; i++){
        difficulty = musicBoxes.getDifficultyString(i);
        [].forEach.call(musicboxes, function(musicbox){
          if(musicbox.className.indexOf(difficulty) != -1){ // 難易度文字列が見つかった時データとして追加
            musicBoxes.setData(i, musicbox);
          }
        });
      }
      console.log("finished getDataByPage()");
      resolve();
    });
  };
  
  /* 開いているページの曲のタイトルを取得する */
  function getTitleByPage(){
    return document.getElementsByClassName('play_musicdata_title')[0].innerText;
  }
  
  /* css ファイルを読み込む (link タグを head に挿入する) */
  function setContentsCSS(){
    return new Promise(function(resolve, reject){
      var link_tag = document.createElement('link');
      link_tag.rel = "stylesheet";
      link_tag.href = "https://mel225.github.io/ChuniCalc/contents.css";
      link_tag.onload = function(){
        console.log("finished setContentsCSS()");
        resolve();
      }
      document.getElementsByTagName('head')[0].appendChild(link_tag);
    });
  };
  
  /* MaxChain 数（ノーツ数）をファイルから取得する */
  function getMaxChainByFile(){
    return new Promise(function(resolve, reject){
      var title = musicBoxes.getTitle();
      var fileURL = "https://mel225.github.io/ChuniCalc/NotesDataTable.txt";
      return getMusicDataByURL(fileURL).then(function(musics){
        if(musics[title] == undefined){
          alert(title + " のデータが見つかりませんでした。");
          return Promise.reject();
        }else{
          console.log("finished getMaxChainByFile()");
          maxChainData = musics[title];
          return;
        }
      });
    });
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

  /*=*=*=*=*=*=*=*=*=*= 以上 各種読み込みメソッド =*=*=*=*=*=*=*=*=*=*/
  
  /*=*=*=*=*=*=*=*=*=*= 以下 ページ操作メソッド =*=*=*=*=*=*=*=*=*=*/
  
  /* BOXデータにDivを追加する */
  function addCalcDiv(box, difficultyNum){
    var difficulty = new MusicData().getDifficultyString(difficultyNum);
    
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
    dataBox.insertBefore(scoreDiv, dataBox.lastElementChild);
    dataBox.insertBefore(notesDiv, dataBox.lastElementChild);
    dataBox.insertBefore(buttonDiv, dataBox.lastElementChild);
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
    box.insertBefore(showButton, box.firstElementChild);
    function show_hide(){
      if(showButton.value == "showing"){
        for(i=3; i<box.children.length; i++){
          box.children[i].style.display = "none";
        }
        showButton.value = "hiding";
        showButton.innerText = "show";
      }else{
        for(i=3; i<box.children.length; i++){
          box.children[i].style.display = "block";
        }
        showButton.value = "showing";
        showButton.innerText = "hide";
      }
    }
  };

  /* スコアの値をdocumentから探してコピーする */
  function setScorePoint(box, difficultyNum) {
    var difficulty = new MusicData().getDifficultyString(difficultyNum);
    /* スコア枠にあるinputタグ(テキストフィールド) */
    var scoreInput = document.getElementById("score_" + difficulty);
      
    /* ページ上のハイスコアが記載されたelement */
    var highScoreDiv = box.getElementsByClassName("text_b")[0];

    /* ハイスコアを数値文字列で取得 */
    var highScore = getNum(highScoreDiv.textContent);

    /* テキストフィールドに値を設定 */
    scoreInput.value = highScore;
  }

  /* MaxChainの値をページ上に設定し、各判定の減点分を表示する */
  function setMaxChain(box, difficultyNum){
    var difficulty = new MusicData().getDifficultyString(difficultyNum);

    /* MaxChainを表示する要素にChain数を書き込む */
    var maxChainDiv = document.getElementById("maxChain_" + difficulty);
    var notes = maxChainData.getData(difficultyNum);
    var n = Number(notes);
    maxChainDiv.innerText += notes;
    maxChainDiv.value = notes;
        
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
        
    document.getElementById('justiceDiv_' + difficulty).appendChild(justiceDif);
    document.getElementById('attackDiv_' + difficulty).appendChild(attackDif);
    document.getElementById('missDiv_' + difficulty).appendChild(missDif);
    return;
  };

  /* 入力欄を初期化する */
  function initCalcDiv(box, difficultyNum){
    var difficulty = new MusicData().getDifficultyString(difficultyNum);
    document.getElementById("justice_" + difficulty).value = "0";
    document.getElementById("attack_" + difficulty).value = "0";
    document.getElementById("miss_" + difficulty).value = "0";
    calculate(difficulty, true); // true: 非表示
  }

  /*=*=*=*=*=*=*=*=*=*= 以上 ページ操作メソッド =*=*=*=*=*=*=*=*=*=*/

  /* 入力された数値をもとに計算を行う */
  function calculate(element, isDisp = true){ // isDisp = true:アラートする false:しない
    var difficulty;
    var variable = "";
    var radioGroup;
    var div_s, div_j, div_a, div_m;
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
        variable = item.value; // value には難易度文字列が登録されている
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

    /* ノーツ数を取得する (parseIntの最後は 10 進数の指定) */
    n = parseInt(maxChainData.getData(maxChainData.getDifficultyNum(difficulty)), 10);

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
    /* 等式 1010000 - (J + 51A + 101M)*10000/n = SCORE から計算する */
    switch(variable){
    case "score":
      score = parseInt(1010000 - (justice + 51*attack + 101*miss) * 10000 / n, 10);
      if(isDisp)
        alert("SCORE が [" + score + "] になりました。");
      div_s.value = String(score);
      break;
      
    case "justice":
      justice = parseInt(((1010000 - score) * n - 510000*attack - 1010000*miss) / 10000, 10);
      if(isDisp)
        alert("JUSTICE が [" + justice + "] になりました。");
      div_j.value = String(justice);
      break;
      
    case "attack":
      var old_justice = justice;
      attack = parseInt(((1010000 - score) * n - 10000*justice - 1010000*miss) / 510000, 10);
      justice = parseInt(((1010000 - score) * n - 510000*attack - 1010000*miss) / 10000, 10);
      if(justice < old_justice){
        attack--;
        justice += 51;
      }
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
      miss = parseInt(((1010000 - score) * n - 10000*justice - 510000*attack) / 1010000, 10);
      justice = parseInt(((1010000 - score) * n - 510000*attack - 1010000*miss) / 10000, 10);
      if(justice < old_justice){
        miss--;
        justice += 101;
      }
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
