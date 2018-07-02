(function(){
  readText(openFile());
  
  function openFile(){
    var reader;
    return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.responseType = "text";
      xhr.addEventListener("load", function(){
        resolve(xhr.response);
      });
      xhr.addEventListener("error", function(){
        console.log("Error occared");
        reject();
      });
      xhr.open('GET', "https://mel225.github.io/ChuniCalc/ChuniNotesDataTable.txt", true);
      xhr.send("");
    }).catch((e)=>{
      console.log(e);
    });
  };
  
  function readText(promise){
    
    return promise.then(function(text){
      /* 外部ファイルの読み込み (MusicData 使用のため) */
      var s = document.createElement('script');
      s.language = "javascript";
      s.src = "https://mel225.github.io/ChuniCalc/getMaxChain.js";
      document.getElementsByTagName('head')[0].appendChild(s);
      
      var line = text.split('\n');
      var musics = [];
      
      if(line.length == 1)
        line = text.split('\r');
      line.forEach(function(data){
        var dataes = data.split(',');
        var music = new MusicData(dataes[0]);
        for(i=1; i<=4; i++){
          music.setData(i, Number(dataes[i]));
        }
        musics.push(music);
      });
      console.log(musics);
      return musics;
    });
  };
})(document)
 
