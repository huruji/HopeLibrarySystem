/*管理员修改设备的函数*/

(function(global,$){
    $("#save").click(function(){
        var equipName=$.trim($("#equipName").val());
        var hopeID=$.trim($("#hopeID").val());
        var equipAdmin=$.trim($("#hopeAdmin").val());
        var equipImgSrc = $("#js-upload-img").attr('src');
        if(!equipName || !hopeID || !equipAdmin){
            layer.alert("设备名、厚朴编号、管理员为必填",{
                skin:'layui-layer-molv'
            });
            return;
        }
            $.ajax({
                dataType:"json",
                async:true,
                data:{"equipName":equipName,"hopeID":hopeID,"equipAdmin":equipAdmin,"equipImgSrc":equipImgSrc},
                type:"POST",
                beforeSend:function(){
                },
                success:function(response){
                    if(response){
                        var success=response.message;
                    
                    if(response.code && response.code==2){
                        layer.alert(success,{
                            skin: 'layui-layer-molv',
                            closeBtn: 0,
                            shift: 2 
                        });
                        return;
                    }else{
                        layer.alert(success,{
                        skin: 'layui-layer-molv',
                        closeBtn: 0,
                        shift: 2 
                    });
                    setTimeout(function(){
                        location.assign("/admin/admin-equip");
                    },500)
                    }
                }
                },
                error:function(){
                    layer.alert("请求失败",{
                        skin: 'layui-layer-molv',
                        closeBtn: 0,
                        shift: 2 
                    });
                },
        });
    });
})(window,jQuery)