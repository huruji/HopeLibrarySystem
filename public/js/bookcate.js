/*用户借阅的函数*/

(function(global,$){
    $(window).scroll(function(){
        console.log($(window).scrollTop());
        if($(window).scrollTop()>=($(document).height()-$(window).height()-200)){
        var bookNum=$(".book-list-item").length;
        $.ajax({
            dataType:"json",
            async:true,
            data:{"bookNum":bookNum},
            type:"POST",
            beforeSend:function(){

            },
            success:function(response){
                for(var i =0,max=response.book.length;i<max;i++){
                    var liClass='book-list-item ';
                    if((i+1)%5 == 0) {
                        liClass+='book-list-item-last ';
                    }
                    var dom=['<li class="' + liClass +'">',
                             '<img src="' + response.book[i].bookImgSrc + '" alt="">',
                             '<p>书名：' + response.book[i].bookName + '</p>',
                             '<p>编号：' + response.book[i].bookHopeID + '</p>',
                             '<button type="" class="borrow-btn" borrowid="' + response.book[i].bookID +'">借阅</button></li>'
                             ].join("");
                    $(dom).appendTo($(".book-list-container:first"));
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