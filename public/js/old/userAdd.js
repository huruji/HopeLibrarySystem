/*管理员修改用户信息的函数*/
(function(global,$){
	$("#save").click(function(){
		console.log("aaaa");
		var userName=$.trim($("#userName").val());
		var userPassword=$("#userPassword").val();
		var sex=$.trim($(":radio[name=sex]:checked").parent().text());
        var studentNumber=$.trim($("#studentNumber").val());
        var readerEmail=$.trim($("#readerEmail").val());
        var readerPhone=$.trim($("#readerPhone").val());
        var readerMajor=$.trim($("#readerMajor").val());
        var readerGroup=$.trim($(":radio[name=hopeGroup]:checked").parent().text());

		$.ajax({
        	dataType:"json",
        	async:true,
        	data:{"readerName":userName,"readerPassword":userPassword,"sex":sex,"studentNumber":studentNumber,"readerEmail":readerEmail,"readerPhone":readerPhone,"readerMajor":readerMajor,"readerGroup":readerGroup},
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
                        location.assign("/admin");
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