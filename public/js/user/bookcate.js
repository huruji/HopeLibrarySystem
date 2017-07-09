/*图书滑动加载的函数*/
define('bookcate', ['jquery', 'hlayer'], function($, hlayer) {
  function scroll() {
    var ajaxWhe = true;
    $(window).scroll(function () {
      if (($(window).scrollTop() >= ($(document).height() - $(window).height() - 1)) && ajaxWhe) {
        var bookNum = $(".main-right-borrow-list-item").length;
        $.ajax({
          dataType: "json",
          async: true,
          data: {"bookNum": bookNum},
          type: "POST",
          beforeSend: function () {
          },
          success: function (response) {
            for (var i = 0, max = response.book.length; i < max; i++) {
              var btn = '';
              if (response.book[i].bookLeft <= 0) {
                btn = '<button disabled="disabled">已借出</button>';
              } else {
                btn = '<button data-borrowID="' + response.book[i].bookID + '" class="js-borrow-btn">借阅</button>';
              }
              var dom = ['<li class="main-right-borrow-list-item">',
                '<div class="main-right-borrow-list-item-img">',
                ' <img src="' + response.book[i].bookImgSrc + '" alt="">',
                '</div>',
                '<div class="main-right-borrow-list-item-message">',
                '<h4>' + response.book[i].bookName + '</h4>',
                '<p>编号：' + response.book[i].bookHopeID + '</p>',
                btn].join('');
              $(dom).appendTo('.main-right-borrow-list');
            }
            borrow();
            if (response.end) {
              var dom = '<p style="text-align:center;margin-bottom:15px">童鞋，工作室已经没有该类书籍了哦！</p>';
              $(".main-right-borrow").append(dom);
              ajaxWhe = false;
            }
          },
          error: function () {
            hlayer.alert({
              text: '请求失败',
              time: 2000,
              mainBg: '#1c95ea',
              icon: 2
            });
          }
        })
      }
    })
  }
  function borrow() {
    $(".js-borrow-btn").click(function(){
      var borrowID=$(this).attr("data-borrowID");
      $.ajax({
        dataType:"json",
        async:true,
        data:{"borrowID":borrowID},
        type:"POST",
        url:"/book/borrow",
        success:function(response){
          hlayer.alert({
            text:response.message,
            time:2000,
            mainBg:'#1c95ea',
            icon:1
          });
          setTimeout(function(){
            location.assign(location.href);
          },2000);
        },
        error:function(){
          hlayer.alert({
            text:'请求失败',
            time:2000,
            mainBg:'#1c95ea',
            icon:2
          });
        }
      })
    })
  }
  return {
    scroll: scroll,
    borrow: borrow
  }
});