/*管理员修改设备的函数*/
(function(global,$){
    $("#save").click(function(){
        var equipName=$.trim($("#equipName").val());
        var hopeID=$.trim($("#hopeID").val());
        var equipAdmin=$.trim($("#hopeAdmin").val());
        $.ajax({
            dataType:"json",
            async:true,
            data:{"equipName":equipName,"hopeID":hopeID,"equipAdmin":equipAdmin},
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