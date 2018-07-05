(function() {
  console.log("========== ChuniCalculation.js begin ==========");
  console.log("-- Projected by mel225 (github, Twitter:@casge_pzl)");

  alert("選択した値を、ほかの値によって計算します。");
  
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
    
    addCalcDiv();
    console.log("addCalcDiv()");
    
    setScorePoint();
    console.log("setScorePoint()");
    
    return setMaxChain();
    console.log("setMaxChain()");
  }).then(function(){
    initCalcDiv();
    console.log("initCalcDiv()");
    
    alert("すべての設定が完了しました。");
  });
  
  /* add <div> Tag */
  function addCalcDiv(){
    databoxes = document.getElementsByClassName("w420 music_box");
    
    Array.prototype.forEach.call(databoxes, setCalcDiv);
  };
  
  /* set <div> statement */
  function setCalcDiv(databox){
    parentclass = databox.className;
    
    /* get difficulty of databox */
    str = 'bg_'
    difficulty = parentclass.slice(parentclass.indexOf(str) + str.length);
    
    /* それぞれのプロパティを設定 */
    var scoreDiv = document.createElement("div"); // SCORE 数値枠
    var notesDiv = document.createElement("div"); // JC 以外の数値枠
    var buttonDiv = document.createElement("div"); // 計算ボタン枠
    var maxChain = document.createElement("span"); // ノーツ数表示枠
    
    scoreDiv.className = "block_underline ptb_5";
    notesDiv.className = "block_underline ptb_5";
    buttonDiv.className = "block_underline ptb_5";
    maxChain.className = "ml_10 mb-10 font_90 maxChain bg_" + difficulty;
    
    scoreDiv.id = "scoreDiv_" + difficulty;
    notesDiv.id = "notesDiv_" + difficulty;
    buttonDiv.id = "buttonDiv_" + difficulty;
    maxChain.id = "maxChain_" + difficulty;
    
    var musicBox = databox.getElementsByClassName("box02 w400")[0];
    var scoreBox = musicBox.firstElementChild;
    musicBox.insertBefore(scoreDiv, musicBox.lastElementChild);
    musicBox.insertBefore(notesDiv, musicBox.lastElementChild);
    musicBox.insertBefore(buttonDiv, musicBox.lastElementChild);
    scoreBox.appendChild(maxChain);

    /* 後で設定しやすいようにmusicBoxにidを付ける */
    musicBox.id = "music_box_" + difficulty;
    
    /* innerHTML, innerText */
    scoreDiv.innerHTML = '' + 
      '<input type="radio" name="radio_'+difficulty+'" value="score">' + 
        '<input type="text" style="width:150px;" id="score_'+difficulty+'">(SCORE)';
    notesDiv.innerHTML = '' + 
      '<div><input type="radio" name="radio_'+difficulty+'" checked="checked" value="justice">'+
        '<input type="text" style="width:80px;" id="justice_'+difficulty+'">JUSTICE</div>' +
          '<div><input type="radio" name=radio_"'+difficulty+'" value="attack">'+
            '<input type="text" style="width:80px;" id="attack_'+difficulty+'">ATTACK</div>' +
              '<div><input type="radio" name="radio_'+difficulty+'" value="miss">' +
                '<input type="text"  style="width:80px;" id="miss_'+difficulty+'">MISS</div>';
    maxChain.innerText = 'MaxChain: ';
    maxChain.value = "";

    /* buttonDiv に乗せるボタンの設定 */
    var calcButton = document.createElement('div');
    //calcButton.href = "JavaScript:void(0);";
    calcButton.className = "btn_calc";
    calcButton.addEventListener("click", calculate);
    calcButton.innerText = "計算";
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
      if(databox.value == "showing"){
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

  /* setting of score point */
  function setScorePoint() {
    var databoxes = document.getElementsByClassName("w420 music_box");

    Array.prototype.forEach.call(databoxes, function(databox){
      var str = 'bg_';
      
      /* get input statement of SCORE */
      var boxesclass = databox.className;
      var difficulty = boxesclass.slice(boxesclass.indexOf(str) + str.length);
      console.log(difficulty);
      var scoreInput = document.getElementById("score_" + difficulty);
      
      /* get high score */
      var highScoreDiv = databox.getElementsByClassName("text_b")[0];
      var highScore = getNum(highScoreDiv.textContent);
      
      scoreInput.value = highScore;
    });
  }
  
  /* get num of notes by name of the tune */
  function setMaxChain(){
    var title = document.getElementsByClassName('play_musicdata_title')[0].innerText;
    var promise = openFile();
    promise = readText(promise);
    return promise.then(function(musics){
      if(musics[title] == undefined){
        alert(title + " のデータが見つかりませんでした。");
      }else{
        var music = musics[title];
        for(i=1; i<=4; i++){
          var diff = music.getDifficultyString(i);
          var maxChain = document.getElementById('maxChain_' + diff);
          if(maxChain != undefined){
            maxChain.innerText += music.getData(i);
            maxChain.value = music.getData(i);
          }
        }
      }
      return;
    });
  }

  /* 入力欄を初期化する */
  function initCalcDiv(){
    var p = new MusicData("");
    var diffs = [p.getDifficultyString(1),
                 p.getDifficultyString(2),
                 p.getDifficultyString(3),
                 p.getDifficultyString(4)];
    diffs.forEach(function(difficulty){
      document.getElementById("justice_" + difficulty).value = "0";
      document.getElementById("attack_" + difficulty).value = "0";
      document.getElementById("miss_" + difficulty).value = "0";
      calculate(difficulty);
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

  /* 入力された数値をもとに計算を行う */
  function calculate(element){
    if((typeof element) != "string"){
      var difficulty = this.id.replace("showhide_", "");
    }else{
      var difficulty = element;
    }
    console.log(difficulty + " in calculate()");
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

    /* ラジオボタンからどの値を計算するのかを探す */
    radioGroup = document.getElementsByName("radio_"+difficulty);
    radioGroup.forEach(function(item){
      if(item.checked){
        variable = item.value;
      }
    });

    /* 入力欄に入力された値を取得する */
    div_s = document.getElementById("score_" + difficulty);
    alert(document.innerHTML);
    alert(div_s);
    score = Number(getNum(div_s.value));
    div_j = document.getElementById("justice_" + difficulty);
    justice = Number(getNum(div_j.value));
    div_a = document.getElementById("attack_" + difficulty);
    attack = Number(getNum(div_a.value));
    div_m = document.getElementById("miss_" + difficulty);
    miss = Number(getNum(div_m.value));

    /* ノーツ数を取得する */
    n = Number(document.getElementById("maxChain_" + difficulty).value);

    if(isNaN(n)){
      console.log("maxChain の value がおかしいらしい",
                  document.getElementById("maxChain_"+difficulty),
                  document.getElementById("maxChain_"+difficulty).value
                  );
    }

    console.log("score: " + score,
                "justice: " + justice,
                "attack: " + attack,
                "miss: " + miss,
                "notes: " + n
                );

    /* 計算を行い、フォームに値をセットし、アラートする */
    switch(variable){
    case "score":
      score = 1010000 - (justice + 51 * attack + 101 * miss) * 10000 / n;
      alert("SCORE の値は " + score + " です。");
      div_s.value = String(score);
      break;
    case "justice":
      justice = ((1010000 - score) * n - 510000 * attack - 1010000 * miss) / 10000;
      alert("JUSTICE の値は " + justice + " です。");
      div_j.value = String(justice);
      break;
    case "attack":
      attack = ((1010000 - score) * n - 10000 * justice - 1010000 * miss) / 510000;
      alert("ATTACK の値は " + attack + " です。");
      div_a.value = String(attack);
      break;
    case "miss":
      miss = ((1010000 - score) * n - 10000 * justice - 510000 * attack) / 1010000;
      alert("MISS の値は " + miss + " です。");
      div_m.value = String(miss);
      break;
    default:
      console.log("ラジオボタンの設定を見直すべきだ");
    }
  }

  /* 文字列から数字以外を削除した新たな文字列を取得 */
  function getNum(str){
    return str.replace(/[^0-9]/g, '');
  }
}) ();
