(function(){
  console.log("================ Begin Program ================");
  var URLs = getLevelURLs();
  var docs = getHTMLdocsByURLs(URLs);
  var tables = getLevelTables(docs);
  createListByDataTable(tables);
  
  function getHTMLdocsByURLs(URLs){
    var Docs = [];
    var index = 0;

    /* recursive function to get HTML Documents by XMLHttpRequest using URLs */
    var pro = function(resolve, reject){
      if(index >= URLs.length){
        return resolve();
      }
      var xhr = new XMLHttpRequest();
      xhr.responseType = "document";
      xhr.addEventListener("load", function(){
        console.log("loaded: " + xhr.response.toString());
        Docs[index] = xhr.response;
        index++;
        // 再帰的に全てにアクセスして、すべて終了したらresolveされる。
        resolve(new Promise(pro));
      });
      xhr.addEventListener("error", function(){
        console.log("error");
        reject('Error happened.');
      });
      xhr.open('GET', URLs[index], true);
      xhr.send("");
    };

    /* return array of documents created by pro function */
    return new Promise(pro).then(function(){
      console.log('then called.');
      console.log(Docs.length, Docs);
      return Docs;
    }).catch((e)=>{
      console.error(e);
    });
  };
  
  function getLevelURLs(){
    var URLs = [
      "https://chunithm.gamerch.com/CHUNITHM%20STAR%20楽曲一覧（Lv順）",
      "https://chunithm.gamerch.com/CHUNITHM%20STAR%20楽曲一覧（Lv順）2",
      "https://chunithm.gamerch.com/CHUNITHM%20STAR%20楽曲一覧（Lv順）3"
    ];
    return URLs;
  };
  
  /* クラス MusicData 一曲の曲名と各難易度のノーツ数を保持 */
  MusicData:{
    MusicData = function(title){ /* this is constlactor */
      this.title = title;
      this.notes = [];
      
      /* methods */
      var p = this.prototype;
      p.setNotes = function(diffNum, notesNum){
        this.notes[diffNum] = notesNum;
      };
      p.getDifficultyNum = function(difficulty){
        var diff = difficulty.toLowerCase();
        var ret;
        switch(diff){
        case "basic": ret = 1; break;
        case "advance": ret = 2; break;
        case "expert": ret = 3; break;
        case "master": ret = 4; break;
        default: ret = 0;
        }
        return ret;
      };
      
    }
  }

  /* useful method */
  function getArrayByList(list){
    console.log("call function getArrayByList()");
    return [].map.call(list, function(item){ return item;});
  };
  var getList_FoundByArray = function(array, callback){
    console.log("call function getList_FoundByArray()");
    var ret = [];
    var index = 0;
    while(true){
      index = array.findIndex(callback);
      console.log(index);
      if(index < 0) break;
      ret.push(array[index]);
      array = array.slice(index+1);
    }
    console.log("returned by getList_FoundByArray(): " + ret);
    return ret;
  };

  /********** 楽曲データ表をすべて取得(Lv.1 - Lv.14) **********/
  function getLevelTables(promise){
    var tables = [];
    var elements;
    var mainSection;
    var docTables;
    var ar;
    
    return promise.then(function(docs){
      console.log(docs + "in then function");
      [].forEach.call(docs, function(doc){
        /* ページ中央の枠内の要素を取得 */
        elements = getArrayByList(doc.getElementById("js_async_main_column_text").children);

        /* 中央の要素から楽曲データの乗った要素を取得 */
        var isClassName = function(e){
          return (e.className == 't-line-img');
        };
        mainSection = getList_FoundByArray(elements, isClassName)[0];

        /* 中央の要素からtable要素を取得 */
        elements = getArrayByList(mainSection.children);
        var isTagName = function(e){
          return (e.tagName.toLowerCase() == 'table');
        }
        docTables = getList_FoundByArray(elements, isTagName);
        tables += docTables;
      });
      console.log("Music table objects: " + tables);
      return tables;
    });
  };

  /********** 楽曲データ表からデータを抽出 **********/
  function createListByDataTable(promise){
    var rows, cols;
    var rowLen, colLen; // 行数 列数
    var i, j; // カウンタ
    var music; // MusicData オブジェクト
    var musics = [];
    var title; // 曲名

    return promise.then(function(tables){
      console.log("function: createListByDataTable(), tables: " + tables);
      [].forEach.call(tables, function(table){
        console.log(table.toString());
        rows = table.rows;
        console.log(rows);
        rowLen = rows.length;
        for(i=0; i<rowLen; i++){
          cols = table.rows[i].cells;
          console.log(cols);
          colLen = cols.length;
          for(j=0; j<colLen; j++){
            if(i==0){
              console.log(table.rows[i].cells[j]);
            }
            // music = new MusicData(title);
          }
        }
      });
      return musics;
    });
  };
    
})(document);
