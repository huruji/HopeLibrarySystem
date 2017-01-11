/*用户归还的函数*/
(function(global,$){
	$(".js-return-btn").click(function(){
		var bookID=$(this).attr("data-bookid"),
		    borrowID=$(this).attr("data-borrowid");
        console.log(borrowID);
		$.ajax({
        	dataType:"json",
        	async:true,
        	data:{"bookID":bookID,"borrowID":borrowID},
        	type:"POST",
        	beforeSend:function(){

        	},
        	success:function(response){
                if(response){
                    var errMsg=response.message;
                }
        			layer.alert(errMsg,{
        				skin: 'layui-layer-molv',
                        closeBtn: 0,
                        shift: 2 
        			});
                    setTimeout(function(){
                        location.assign(location.href);
                    },500)
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
	})
})(window,jQuery)