/*用户借阅的函数*/

(function(global,$){
	$(".check-yes").click(function(){
		var equipID=$(this).attr("data-equipid");
        console.log(equipID);
		$.ajax({
        	dataType:"json",
        	async:true,
        	data:{"equipID":equipID,"check":true},
        	type:"POST",
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
	});

    $(".check-no").click(function(){
        var equipID=$(this).attr("data-equipID");
        $.ajax({
            dataType:"json",
            async:true,
            data:{"equipID":equipID,"check":false},
            type:"POST",
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