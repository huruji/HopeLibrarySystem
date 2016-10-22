/*登录函数*/
$(document).ready(function(){
	$("#loginBtn").click(function(){
		var userName=$("#username").val();
		var password=$("#password").val();
		if(!userName){
			layer.alert("请输入用户名，最多16位字符",{
				skin:"loyui-layer-molv",
				closeBtn:0,
				shift:2
			});
			return;
		}
		if(password){
			if(password.length<6){
				layer.alert('请至少输入6位密码', {
                        skin: 'layui-layer-molv', 
                        closeBtn: 0,
                        shift: 2
                    });
                    return;
			}
		}else {
            layer.alert('请输入6~16位密码', {
                skin: 'layui-layer-molv',  
                closeBtn: 0,
                shift: 2 
            });
            return;
        }
        $.ajax({

        	dataType:"json",
        	async:true,
        	data:{"username":userName,"password":password},
        	type:"POST",
        	beforeSend:function(){

        	},
        	success:function(response){
        		var errMsg="登录失败";
        			if(response){
        				if(response.code==0 && response.userId){
                            var p=location.pathname,
                                redirect="/"+p.split("/")[1];
                            window.location=redirect;
        					return 0;
        				}
        				if(response.message){
        					errMsg=response.message;
        				}
        			}
        			layer.alert(errMsg,{
        				skin: 'layui-layer-molv',
                        closeBtn: 0,
                        shift: 2 
        			});
        		},
        	error:function(){
        		layer.alert("请求失败，请重试！",{
        			skin: 'layui-layer-molv',  
                    closeBtn: 0,
                    shift: 2 
        		});
        	},
        	complete:function(){
        		
        	}

        })
	})
})