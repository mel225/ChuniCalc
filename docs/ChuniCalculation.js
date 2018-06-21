(function() {
  function test2(){
    alert("test2");
  };

  alert("選択した値を、ほかの値によって計算します。");

  setContentsCSS();
  Console.log("setContentsCSS()");
  
  addCalcDiv();
  Console.log("addCalcDiv()");
  
  alert("すべての設定が完了しました。");
  
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
    divdoc = document.getElementById("music_detail");
    databoxes = document.getElementsByClassName("box02 w400");
    
    Array.prototype.forEach.call(databoxes, setCalcDiv);

    /* set <div> statement */
    function setCalcDiv(item){
      databox = item;
      parentclass = databox.parentNode.className;
      
      /* get difficulty of databox */
      if(parentclass.search("basic") != -1){
        difficulty = "basic";
      }else if(parentclass.search("advanced") != -1){
        difficulty = "advanced";
      }else if(parentclass.search("expert") != -1){
        difficulty = "expert";
      }else if(parentclass.search("master") != -1){
        difficulty = "master";
      }
      
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
        
        iconDiv = databox.getElementsByClassName("play_musicdata_icon").item(0);
        databox.insertBefore(scoreDiv, iconDiv);
        databox.insertBefore(notesDiv, iconDiv);
        databox.insertBefore(buttonDiv, iconDiv);
        
        /* innerHTML */
        scoreDiv.innerHTML = '' + 
          '<div><input type="radio" name="'+difficulty+'">' + 
            '<input type="text" style="width:150px;" name="score_'+difficulty+'">(SCORE)</div>'/* +
              '<a href="javascript:void(0);" onclick="test2()"><strong>test2</strong></a>'*/;
        notesDiv.innerHTML = '' + 
          '<div><input type="radio" name="'+difficulty+'">'+
            '<input type="text" style="width:80px;"name="justice_'+difficulty+'">JUSTICE</div>' +
              '<div><input type="radio" name="'+difficulty+'">'+
                '<input type="text" style="width:80px;" name="attack_'+difficulty+'">ATTACK</div>' +
                  '<div><input type="radio" name="'+difficulty+'">' +
                    '<input type="text"  style="width:80px;" name="miss_'+difficulty+'">MISS</div>';
        buttonDiv.innerHTML = '' +
          '<a herf="javascript:void(0);" onclick="test2">' + 
           '<div class="honor_now btn_calc">計算</div></a>';
      }
    };
  };
  
  /* setting of contents.css in this repositry */
  function setContentsCSS(){
    alert("set CSS");
    var link_tag = document.createElement('link');
    link_tag.rel = "stylesheet";
    link_tag.href = "https://mel225.github.io/ChuniCalc/docs/contents.css";
    document.getElementsByTagName('head')[0].appendChild(link_tag);
    alert("did set CSS");
  };
}) ();
