$("#loginout").click(function(){
		document.cookie="adminId=;max-age=0";
		document.cookie="userId=;max-age=0";
		location.assign("/");
		})