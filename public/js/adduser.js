/*管理员增加书籍的函数*/
(function(global,$){
    $(":radio[name=permission]").click(function(){
        if($(this).attr("permission")=="user"){
            $(".hope-group").css("display","block");
        }else{
            $(".hope-group").css("display","none");
        }
    })
    $("#save").click(function(){
        var permission=$(":radio[name=permission]:checked").attr("permission");
        var hopeGroup=$(":radio[name=hopeGroup]:checked").parent().text();
        var readerName=$("#readerName").val()
        var readerEmail=$("#email").val();
        var password=$("#password").val();
        var confirmPassword=$("#confirmPassword").val();
        console.log(password);
        console.log(confirmPassword);
        if(!permission || !readerName || !readerEmail || !password){
            layer.alert("用户名、权限、邮箱、密码为必填",{
                    skin: 'layui-layer-molv',
            });
            return;
        }
        if(password.length<6 || password.length>12){
            layer.alert("密码为6-12位",{
                    skin: 'layui-layer-molv',
            });
            return;
        }
        if(password!==confirmPassword){
            layer.alert("前后两次密码不一致",{
                    skin: 'layui-layer-molv',
            });
            return;
        }
        if(permission=="user" && !hopeGroup){
            layer.alert("普通用户的厚朴组为必填",{
                skin: 'layui-layer-molv',
            })
            return;
        }
        if(permission=="user" && hopeGroup){
            var data={
                readerName:readerName,
                readerEmail:readerEmail,
                password:password,
                permission:permission,
                hopeGroup:hopeGroup
            }
        }
        if(permission.indexOf("admin")>=0){
            var data={
                readerName:readerName,
                readerEmail:readerEmail,
                password:password,
                permission:permission,
            }
        }
        console.log("data:"+data);
        $.ajax({
            dataType:"json",
            data:data,
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
            }
        })
    });
})(window,jQuery)