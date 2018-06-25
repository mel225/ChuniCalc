javascript:(
function(){
  var loaded = false;
  var getHTMLdocsByURLs = function(URLs){
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
    p = new Promise(pro).then(function(){
      console.log('then called.');
      loaded = true;
      return Docs;
    }).catch((e)=>{
      console.error(e);
    });
    console.log(p);
    return p;
  };
  
  var getLevelURLs = function(){
    var tables = document.getElementsByTagName('table');
    var levels;
    Array.prototype.forEach.call(tables, function(table) {
      var value = table.getElementsByClassName('f2');
      if(value.length == 21){
        levels = value;
      }
    });
    return [].map.call(levels, function(value){
      return value.getElementsByTagName('a')[0].toString();
    });
  };

  var URLs = getLevelURLs();
  var docs = getHTMLdocsByURLs(URLs);
  while(!loaded);
  console.log(docs.length, docs);
})(document);