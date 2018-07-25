(function(){
  readOuterJs("readFile.js").then(function(){
    return openTextFile("NotesDataTable.txt");
  }).then(function(musics){
    return getTitles(musics);
  }).then(function(notExists){
    for(var title in notExists){
      console.log(title);
    }
  });

  /* 外部ファイルをファイル名から読み込む */
  function readOuterJs(filename){
    return new Promise(function(resolve, reject){
      var id = "mel225_" + filename;
      var s;
      if(document.getElementById(id) == undefined){
        s = document.createElement('script');
        s.src = "https://mel225.github.io/ChuniCalc/" + filename;
        s.id = id;
        s.addEventListener("load", function(){
          resolve();
        });
        s.addEventListener("error", function(){
          console.log(filename, "Error occared");
          reject();
        });
        document.getElementsByTagName('head')[0].appendChild(s);
      }
    });
  };

  /* NotesDataTableに無いタイトルの一覧を取得する */
  function getTitles(musics){
    return new Promise(function(resolve, reject){
      var notExists = [];
      [].forEach.call(document.getElementsByClassName("w388 musiclist_box bg_master"), function(item){
        var title = item.firstElementChild.innerText;
        if(musics[title] == undefined){
          notExists.push(title);
        }
      });
      resolve(notExists);
    });
  }
  
}) ()