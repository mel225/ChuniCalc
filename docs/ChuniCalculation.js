(function() {
  function test2(){
    alert("test2");
  };

  alert("選択した値を、ほかの値によって計算します。");

  setContentsCSS();
  console.log("setContentsCSS()");
  
  addCalcDiv();
  console.log("addCalcDiv()");

  setScorePoint();
  console.log("setScorePoint()");
  
  alert("すべての設定が完了しました。");

  console.log(document.getElementById("calc_button").clientWidth);
  
  /*
  $('.btn_calc').css({
    "display":"inline-block",
    "padding":"0.5em, 1em",
    "text-decoration":"none",
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
    /*
    if(parentclass.search("basic") != -1){
      difficulty = "basic";
    }else if(parentclass.search("advanced") != -1){
      difficulty = "advanced";
    }else if(parentclass.search("expert") != -1){
      difficulty = "expert";
    }else if(parentclass.search("master") != -1){
      difficulty = "master";
    }
     */
    str = 'bg_'
    difficulty = parentclass.slice(parentclass.indexOf(str) + str.length);
    console.log(difficulty);
    
    /* 既にツールが展開されていれば実行しない */
    always = document.getElementById("scoreDiv_" + difficulty);
    if(always == undefined) {
      
      /* それぞれのdivのプロパティを設定 */
      scoreDiv = document.createElement("div");
      notesDiv = document.createElement("div");
      buttonDiv = document.createElement("div");
      
      scoreDiv.className = "block_underline ptb_5";
      notesDiv.className = "block_underline ptb_5";
      buttonDiv.className = "block_underline ptb_5";
      
      scoreDiv.id = "scoreDiv_" + difficulty;
      notesDiv.id = "notesDiv_" + difficulty;
      buttonDiv.id = "buttonDiv_" + difficulty;

      parentNode = databox.getElementsByClassName("box02 w400")[0];
      iconDiv = databox.getElementsByClassName("play_musicdata_icon").item(0);
      parentNode.insertBefore(scoreDiv, iconDiv);
      parentNode.insertBefore(notesDiv, iconDiv);
      parentNode.insertBefore(buttonDiv, iconDiv);
      
      /* innerHTML */
      scoreDiv.innerHTML = '' + 
        '<div><input type="radio" name="'+difficulty+'">' + 
          '<input type="text" style="width:150px;" id="score_'+difficulty+'">(SCORE)</div>'/* +
              '<a href="javascript:void(0);" onclick="test2()"><strong>test2</strong></a>'*/;
      notesDiv.innerHTML = '' + 
        '<div><input type="radio" name="'+difficulty+'">'+
          '<input type="text" style="width:80px;" id="justice_'+difficulty+'">JUSTICE</div>' +
            '<div><input type="radio" name="'+difficulty+'">'+
              '<input type="text" style="width:80px;" id="attack_'+difficulty+'">ATTACK</div>' +
                '<div><input type="radio" name="'+difficulty+'">' +
                  '<input type="text"  style="width:80px;" id="miss_'+difficulty+'">MISS</div>';
      buttonDiv.innerHTML = '' +
        '<a herf="javascript:void(0);" onclick="test2" class="btn_calc_back">' + 
          '<div id="calc_button" class="honor_now btn_calc">計算</div></a>';
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
      console.log(typeof databox);
      var boxesclass = databox.className;
      var difficulty = boxesclass.slice(boxesclass.indexOf('bg_'));
      var scoreInput = databox.getElementById("scoreDiv").getElementById("score_" + difficulty);
      var highScoreDiv = databox.getElementsByClassName("text_b")[0];

      var score = perseInt(highScoreDiv.textContent);
      scoreInput.value = score;
    });
  }
}) ();
