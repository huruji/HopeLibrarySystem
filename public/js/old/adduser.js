/*管理员增加用户的函数*/
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
            hlayer.alert({
                text:'用户名、权限、邮箱、密码为必填',
                time:2000,
                mainBg:'#1c95ea',
                icon:2
            });
            return;
        }
        if(password.length<6 || password.length>12){
            hlayer.alert({
                text:'密码为6-12位',
                time:2000,
                mainBg:'#1c95ea',
                icon:2
            });
            return;
        }
        if(password!==confirmPassword){
            hlayer.alert({
                text:'前后两次密码不一致',
                time:2000,
                mainBg:'#1c95ea',
                icon:2
            });
            return;
        }
        if(permission=="user" && !hopeGroup){
            hlayer.alert({
                text:'普通用户的厚朴组为必填',
                time:2000,
                mainBg:'#1c95ea',
                icon:2
            });
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
            success:function(response){
                hlayer.alert({
                    text: response.message,
                    time:2000,
                    mainBg:'#1c95ea',
                    icon:1
                });
                setTimeout(function(){
                    location.assign("/admin");
                },2000)
            },
            error:function(){
                hlayer.alert({
                    text: '请求失败',
                    time:2000,
                    mainBg:'#1c95ea',
                    icon:2
                });
            }
        })
    });
})(window,jQuery);