/*管理员自行修改信息的函数*/
(function(global,$){
	$("#save").click(function(){
        var readerEmail=$.trim($("#readerEmail").val());

		$.ajax({
        	dataType:"json",
        	async:true,
        	data:{"readerEmail":readerEmail},
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
                        var p=location.pathname,
                            redirect="/"+p.split("/")[1];
                        document.location=redirect;
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
})(window,jQuery)