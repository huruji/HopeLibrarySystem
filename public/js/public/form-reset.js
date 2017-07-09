define('form-reset',function() {
  function formReset() {
    var form = document.getElementsByClassName('main-right-form')[0];
    var formFroups = [].slice.call(form.getElementsByClassName('form-group'));
    formFroups.forEach(function(ele){
      var input = ele.getElementsByTagName('input')[0];
      if(input.getAttribute('disabled') !== 'disabled'){
        input.value = '';
      }
    });
  }
//兼容IE10及以下的事件绑定函数
  function addEvent(ele,event,fn){
    if(window.attachEvent){
      return ele.attachEvent("on"+event,fn);
    }else{
      return ele.addEventListener(event, fn,false);
    }
  }
  return function() {
    var reset = document.getElementById('js-form-reset');
    addEvent(reset,'click',formReset);
  }
});