(function(){
  /* 外部ファイルの読み込み (MusicData 使用のため) */
  var id = "mel225_MusicData.js";
  if(document.getElementById(id) == undefined){
    var s = document.createElement('script');
    s.src = "https://mel225.github.io/ChuniCalc/MusicData.js";
    s.id = id;
    document.getElementsByTagName('head')[0].appendChild(s);
  }
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
      text.replace('\r\n', '\n');
      var line = text.split('\n');
      var musics = [];
      
      line.forEach(function(data){
        var dataes = data.split(',');
        if(dataes[0] != ""){
          var music = new MusicData(dataes[0]);
          for(i=1; i<=4; i++){
            music.setData(i, Number(dataes[i]));
          }
          musics.push(music);
        }
      });
      console.log(musics);
      return musics;
    });
  };
})(document)
 
