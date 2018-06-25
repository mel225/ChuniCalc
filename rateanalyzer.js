javascript:(function(){
  function callback(){
    (function($){
      var jQuery=$;
      $("head").append("<script src='https://zk-phi.github.io/CHUNITHMRateAnalyzer/chunithm.js'>")
    })(jQuery.noConflict(true))
  }
  var s=document.createElement("script");
  s.src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
  if(s.addEventListener){
    s.addEventListener("load",callback,false)
  }else if(s.readyState){
    s.onreadystatechange=callback
  }
  document.body.appendChild(s);
})()