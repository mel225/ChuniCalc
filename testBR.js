javascript:(
  function(d, s){
    var id = 'mel225_ChuniCalc';
    if(d.getElementById(id) == undefined){
      s = d.createElement('script');
      s.src = 'https://mel225.github.io/ChuniCalc/ChuniCalculation.js';
      s.id = id;
      d.getElementsByTagName('head')[0].appendChild(s);
    }
  }
)(document);