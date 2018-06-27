(function(){
  var cnt = 1;
  [].forEach.call(document.scripts, function(s){
    s.id = "rmScripts_" + cnt;
    cnt += 1;
  });
  cnt -= 1;
  while(cnt > 0){
    document.getElementById("rmScripts_" + cnt).remove();
    cnt -= 1;
  }
}) (document)

/*
javascript:
(function(d, s){
  s = d.createElement('script');
  s.src = "https://mel225.github.io/ChuniCalc/rmScript.js";
  d.getElementsByTabName('head')[0].appendChild(s);
}) (document)
*/