javascript:(function(){
  var temp=document.createElement('textarea');
  temp.value="“K“–‚È•Ï”";
  temp.selectionStart=0;
  temp.selectionEnd=temp.value.length;
  var s=temp.style;
  s.position='fixed';
  s.left='-100%';
  document.body.appendChild(temp);
  temp.focus();
  var result=document.execCommand('copy');
  temp.blur();
  document.body.removeChild(temp);
})();