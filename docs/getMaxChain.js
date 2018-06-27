(function(){
  console.log("================ Begin Program ================");
  function toStr(item){ return Object.prototype.toString.call(item); };
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
      var p = MusicData.prototype;
      p.setNotes = function(diffNum, notesNum){
        this.notes[Number(diffNum)] = notesNum;
      };
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
      p.setTitle = function(title){
        this.title = title;
      };
      p.getData = function(diffNum){
        return this.notes[diffNum];
      };
      p.getTitle = function(){
        return this.title;
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
        [].push.apply(tables, docTables);
      });
      return tables;
    });
  };

  /********** 楽曲データ表からデータを抽出 **********/
  function createListByDataTable(promise){
    var rowLen, colLen; // 行数 列数
    var i, j; // カウンタ
    var music; // MusicData オブジェクト
    var musics = {};
    var title; // 曲名
    var html; // outerHTML
    var diffName; // 難易度
    var diffNum; // 難易度番号
    var notesNum; // ノーツ数

    return promise.then(function(tables){
      console.log("function: createListByDataTable(), tables(" + tables.length + "): " + tables);
      var onceExe = true;
      
      [].forEach.call(tables, function(table){
        rowLen = table.rows.length;
        for(i=1; i<rowLen; i++){
          colLen = table.rows[i].cells.length;
          for(j=0; j<colLen; j++){
            html = table.rows[i].cells[j];
            switch(html.getAttribute('data-col')){
            case '0': diffName = html.innerText; break;
            case '2':
              var tagA = html.getElementsByTagName('a')[0];
              title = tagA.getAttribute('title');
              break;
            case '3': notesNum = Number(html.innerText); break;
            }
          }
          if(title != undefined){
            // titleで既にデータが存在してるか確認
            if(musics[title] == undefined){
              musics[title] = new MusicData(title);
            }
            // 難易度番号を取得し、ノーツ数を登録する。
            diffNum = musics[title].getDifficultyNum(diffName);
            musics[title].setNotes(diffNum, notesNum);
            // debug print
            if(onceExe){
              console.log(title, diffName, diffNum, notesNum);
              console.log(musics[title]);
              console.log("notes: " + musics[title].getData(diffNum));
            }
          }
        }
        onceExe = false;
      });

      console.log("musics.length: " + Object.keys(musics).length);
      for(key in musics){
        music = musics[key];
        console.log("========" + music.getTitle);
        var diffName;
        for(i=1; i<=4; i++){
          switch(i){
            case 1: diffName = "BASIC"; break;
            case 2: diffName = "ADVANCED"; break;
            case 3: diffName = "EXPERT"; break;
            case 4: diffName = "MASTER"; break;
          }
          console.log(diffName, music.getData(i));
        }
        break;
      }
      return musics;
    });
  };
    
})(document);
