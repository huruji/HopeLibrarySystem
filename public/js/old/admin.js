/*删除用户的函数*/
(function(global,$){
	$(".js-drop-user").click(function(){

		var dropData=$(this).attr("data-user-data");
        console.log(111);
        layer.confirm("删除用户将会删除该用户的所有信息",{
            skin: 'layui-layer-molv',
            btn:["确认","取消"],
            btn1:function(){
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
            }
        })
        
	})
})(window,jQuery)

