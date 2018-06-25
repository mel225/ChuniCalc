(function(){
  var URLs = getLevelURLs();
  var docs = getHTMLdocsByURLs(URLs);
  var tables = getLevelTables(docs);
  console.log(docs.length, docs);
  
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
  
  /* MusicData Class define */
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
    //return [].map.call(list, (node)=>{return node;});
    return [].map.call(list, function(item){ return item;});
  };
  var getList_FoundByArray = function(array, callback){
    console.log("call function getList_FoundByArray()");
    console.log("-- array: " + array);
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
  
  function getLevelTables(promise){
    var tables = [];
    return promise.then(function(docs){
      console.log(docs + "in then function");
      [].forEach.call(docs, function(doc){
        console.log(doc + " in getLevelTables");
        var elements = getArrayByList(doc.getElementById("js_async_main_column_text").children);
        console.log("check end function getArrayByList()");
        var mainSection = getList_FoundByArray(elements, function(e){return(e.className=='t-line-img');})[0];
        console.log("check end function getList_FoundByArray()");
        elements = getArrayByList(mainSection.children);
        var docTables = getList_FoundByArray(elements, function(e){console.log("callback " + e.tagName + e.tag);return(e.tagName=='table');});
        tables.push(getList_FoundByArray(docTables, function(t){
          console.log(t);
          return (t.rows[0].length > 1);
        }));
      });
      return tables;
    });
  };
})(document);
