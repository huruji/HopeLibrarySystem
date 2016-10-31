/*用户借阅的函数*/

(function(global,$){
    var ajaxWhe = true;
    $(window).scroll(function(){
        console.log(ajaxWhe);
        if(($(window).scrollTop()>=($(document).height()-$(window).height()-1)) && ajaxWhe){
        var bookNum=$(".book-list-item").length;
        console.log(bookNum);
        $.ajax({
            dataType:"json",
            async:true,
            data:{"bookNum":bookNum},
            type:"POST",
            beforeSend:function(){

            },
            success:function(response){
                console.log("response.book.length:"+response.book.length);
                for(var i =0,max=response.book.length;i<max;i++){
                    var liClass='book-list-item ';
                    var imgMask = "";
                    var borrowAble = "";
                    if((i+1)%5 == 0) {
                        liClass+='book-list-item-last ';
                    }
                    if(!response.book[i].bookLeft){
                        imgMask = '<div class="img-mask"></div>';
                        borrowAble = " disabled";
                    }
                    var dom=['<li class="' + liClass +'">',
                             '<img src="' + response.book[i].bookImgSrc + '" alt="">' + imgMask,
                             '<p>书名：' + response.book[i].bookName + '</p>',
                             '<p>编号：' + response.book[i].bookHopeID + '</p>',
                             '<button type="" class="borrow-btn" borrowid="' + response.book[i].bookID + ' " ' + borrowAble + '>借阅</button></li>'
                             ].join("");
                    $(dom).appendTo($(".book-list-container:first")); 
                }
                if(response.end){
                        var dom = '<p style="text-align:center;margin-bottom:15px">童鞋，工作室已经没有该类书籍了哦！</p>';
                        $(".main-content .container").append(dom);
                        ajaxWhe = false;
                    }
                },
            error:function(){
                layer.alert("请求失败",{
                        skin: 'layui-layer-molv',
                        closeBtn: 0,
                        shift: 2 
                    });
            },
            complete:function(){
                
            }

        })
        }
    })
	
})(window,jQuery)