(function() {
  console.log("========== ChuniCalculation.js begin ==========");
  console.log("-- Projected by mel225 (github, Twitter:@casge_pzl)");

  alert("選択した値を、ほかの値によって計算します。");
    
  new Promise(function(resolve, reject){
    
    /* 外部ファイルの読み込み */
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
    // 時間がかかるのでプロミスにする。
    resolve(new Promise(pro));
  })
    .then(function(){
      setContentsCSS();
      console.log("setContentsCSS()");
      
      addCalcDiv();
      console.log("addCalcDiv()");
      
      setScorePoint();
      console.log("setScorePoint()");
      
      setMaxChain();
      console.log("setMaxChain()");
      
      alert("すべての設定が完了しました。");
    });
  
  /*
  $('.btn_calc').css({
    "display":"inline-block",
    "padding":"0.5em, 1em",
    "ext-decoration":"none",
    "font-weight":"bold",
    "border-radius":"4px",
    "color":"rgba(0, 69, 212, 0.47)",
    "text-shadow":"1px 1px 1px rgba(255, 255, 255, 0.5)",
    "background-image":"-webkit-linear-gradient(#6795fd 0%, #67ceff 100%)",
    "background-image":"linear-gradient(#6795fd 0%, #67ceff 100%)",
    "box-shadow":"0px, 2px, 2px, rgba(0, 0, 0, 0.29)",
    "border-bottom":"solid 3px #5e7fca"
    });
  $('.btn_calc:active').css({
    "-ms-transform":"translateY(4px)",
    "-webkit-transform":"translateY(4px)",
    "transform":"translateY(4px)",
    "box-shadow":"0px 0px 1px rgba(0, 0, 0, 0.2)",
    "border-bottom":"none"
    });
  */
  
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
    musicBox.value = "show";
    
    /* innerHTML, innerText */
    scoreDiv.innerHTML = '' + 
      '<input type="radio" name="radio_'+difficulty+'" checked="checked">' + 
        '<input type="text" style="width:150px;" id="score_'+difficulty+'">(SCORE)';
    notesDiv.innerHTML = '' + 
      '<div><input type="radio" name="radio_'+difficulty+'">'+
        '<input type="text" style="width:80px;" id="justice_'+difficulty+'">JUSTICE</div>' +
          '<div><input type="radio" name=radio_"'+difficulty+'">'+
            '<input type="text" style="width:80px;" id="attack_'+difficulty+'">ATTACK</div>' +
              '<div><input type="radio" name="radio_'+difficulty+'">' +
                '<input type="text"  style="width:80px;" id="miss_'+difficulty+'">MISS</div>';
    maxChain.innerText = 'MaxChain: ';

    /* buttonDiv に乗せるボタンの設定 */
    var calcButton = document.createElement('a');
    calcButton.href = "JavaScript:void(0);";
    calcButton.className = "btn_calc";
    calcButton.addEventListener("click", calculate);
    calcButton.innerText = "計算";
    buttonDiv.appendChild(calcButton);

    /* 表示/非表示ボタンを付けて織り込めるようにする */
    var showButton = document.createElement('div');
    showButton.className = "btn_show";
    showButton.addEventListener("click", show_hide);
    showButton.innerText = "show";
    musicBox.insertBefore(showButton, musicBox.firstElementChild);
    function show_hide(){
      if(musicBox.value == "show"){
        for(i=2; i<musicBox.children.length; i++){
          musicBox.children.style.display = "none";
        }
        musicBox.value = "hide";
      }else{
        for(i=2; i<musicBox.children.length; i++){
          musicBox.children.style.display = "block";
        }
        musicBox.value = "show";
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
      var highScore = highScoreDiv.textContent.replace(/[^0-9]/g, '');
      
      scoreInput.value = highScore;
    });
  }
  
  /* get num of notes by name of the tune */
  function setMaxChain(){
    var title = document.getElementsByClassName('play_musicdata_title')[0].innerText;
    var promise = openFile();
    promise = readText(promise);
    promise.then(function(musics){
      if(musics[title] == undefined){
        alert(title + " のデータが見つかりませんでした。");
      }else{
        var music = musics[title];
        for(i=1; i<=4; i++){
          var diff = music.getDifficultyString(i);
          var maxChain = document.getElementById('maxChain_' + diff);
          if(maxChain != undefined){
            maxChain.innerText += music.getData(i);
          }
        }
      }
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

  function calculate(){
    alert("EventListener");
  }
}) ();
