(function(){/* クラス MusicData 一曲の曲名と各難易度のノーツ数を保持 */
MusicData:{
  MusicData = function(title){ /* this is constlactor */
    this.title = title;
    this.notes = [];
    
    /* methods */
    var p = MusicData.prototype;

    // 文字列から難易度番号を取得
    p.getDifficultyNum = function(difficulty){
      var diff = difficulty.toLowerCase();
      var ret;
      switch(diff){
      case "basic": case "bas": ret = 1; break;
      case "advance": case "adv": ret = 2; break;
      case "expert": case "exp": ret = 3; break;
      case "master": case "mas": ret = 4; break;
      default: ret = 0;
      }
      return ret;
    };

    // 指定難易度のノーツ数を設定
    p.setNotes = function(diffNum, notesNum){
      this.notes[Number(diffNum)] = notesNum;
    };

    // 曲名を設定
    p.setTitle = function(title){
      this.title = title;
    };

    // 指定難易度のノーツ数を取得
    p.getData = function(diffNum){
      return this.notes[diffNum];
    };

    // 曲名を取得
    p.getTitle = function(){
      return this.title;
    };

    // データを CSV 形式で取得
    p.print = function(){
      var s = "";
      s += this.title;
      for(i=1; i<=4; i++){
        s += "," + this.notes[i]; 
      }
      return s;
    }
  }
}) ()