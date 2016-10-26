/*删除用户的函数*/
(function(global,$){
	$(".drop-user").click(function(){
		var dropData=$(this).attr("user-data");
        console.log(111);
		$.ajax({
        	dataType:"json",
        	async:true,
        	data:{"dropData":dropData},
        	type:"POST",
            url:"/admin/admindropuser",
        	beforeSend:function(){     
        	},
        	success:function(response){
                if(response){
                    var success=response.message;
                }
        			layer.alert(success,{
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

