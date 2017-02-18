/*登录函数*/
$(document).ready(function(){
	$('form').bind('keydown',function(e){
		if(e.keyCode === 13){
            $("#loginBtn").click();
		}
	});
	$("#loginBtn").bind('click', function(){
		var userName=$("#username").val();
		var password=$("#password").val();
		if(!userName){
			$('p.login-bg-error').remove();
            var $p = '<p class="login-bg-error">请输入用户名，最多16位字符</p>';
            $('.login-bg-btn').before($p);
			return;
		}
		if(password){
			if(password.length<6){
                $('p.login-bg-error').remove();
                var $p = '<p class="login-bg-error">请至少输入6位密码</p>';
                $('.login-bg-btn').before($p);
                return;
				
			}
		}else {
            $('p.login-bg-error').remove();
            var $p = '<p class="login-bg-error">请输入6~16位密码</p>';
            $('.login-bg-btn').before($p);
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
                	$('p.login-bg-error').remove();
                	var $p = '<p class="login-bg-error">' + errMsg + '</p>';
                	$('.login-bg-btn').before($p);
        		},
        	error:function(){
                $('p.login-bg-error').remove();
                var $p = '<p class="login-bg-error">请求失败，请重试！</p>';
                $('.login-bg-btn').before($p);
        	},
        	complete:function(){
        		
        	}

        })
	})
});