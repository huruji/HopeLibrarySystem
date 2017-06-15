/*管理员修改用户信息的函数*/
(function(global,$){
    var type=$("#user-form").attr("form-data");
    if(type=="user"){
        $("#save").click(function(){
        var sex=$.trim($(":radio[name=sex]:checked").parent().text());
        var studentNumber=$.trim($("#studentNumber").val());
        var readerEmail=$.trim($("#readerEmail").val());
        var readerPhone=$.trim($("#readerPhone").val());
        var readerMajor=$.trim($("#readerMajor").val());
        console.log(readerMajor);
        var readerGroup=$.trim($(":radio[name=hopeGroup]:checked").parent().text());
        var readerName=$.trim($("#readerName").val());
        if(!readerName || !readerEmail || !sex || !readerGroup){
            layer.alert("用户名、性别、邮箱、厚朴组为必填",{
                skin: 'layui-layer-molv'
            });
            return;
        }
        $.ajax({
            dataType:"json",
            async:true,
            data:{"readerName":readerName,"sex":sex,"studentNumber":studentNumber,"readerEmail":readerEmail,"readerPhone":readerPhone,"readerMajor":readerMajor,"readerGroup":readerGroup},
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
    }else if(type=="admin"){
        $("#save").click(function(){
        var permission=$.trim($(":radio[name=permission]:checked").parent().attr("user-type"));
        var readerEmail=$.trim($("#readerEmail").val());
        var readerName=$.trim($("#adminName").val());
        if(!readerName || !readerEmail || !permission){
            layer.alert("用户名、邮箱、权限为必填",{
                skin: 'layui-layer-molv'
            });
            return;
        }
        $.ajax({
            dataType:"json",
            async:true,
            data:{"readerName":readerName,"readerEmail":readerEmail,"permission":permission},
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
    }
	
})(window,jQuery)