/*用户借阅的函数*/
(function(global,$){
	$(".js-borrow-btn").click(function(){
		var borrowID=$(this).attr("data-borrowID");
        console.log(borrowID);
		$.ajax({
        	dataType:"json",
        	async:true,
        	data:{"borrowID":borrowID},
        	type:"POST",
            url:"/book/borrow",
        	success:function(response){
                if(response){
                    if(response.code==10){
                        location.assign("/user/login")
                    }else{
                        errMsg=response.message;
                    }
                    console.dir(response);
                }
        			layer.alert(errMsg,{
        				skin: 'layui-layer-molv',
                        closeBtn: 0,
                        shift: 2 
        			});
                    setTimeout(function(){
                        location.assign(location.href);
                    },500);
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