
(function(global,$){
	$(".js-borrow-btn").click(function(){
		var equipID=$(this).attr("data-reservationID");
		$.ajax({
        	dataType:"json",
        	async:true,
        	data:{"equipID":equipID},
        	type:"POST",
            url:"/equip/equipemail",
        	beforeSend:function(){     
        	},
        	success:function(response){
                    if(response){
                        if(response.noLogin){
                            location.assign("/user/login");
                            return;
                        }else{
                        var contentHTML = ['<div class="reservation-container"><P class="reservation">你预约的设备是',
                                          response.equipName,
                                          '，管理员是',
                                          response.adminName,
                                          '，请填写你需要发送给管理员的信息(如：取设备的时间，需要的配件），',
                                          '可为空</p><textarea name="" id="email-info" style="width:100%;display:block;" rows=10></textarea></div>"'].join("");
                        layer.open({
                            type:1,
                            title:"预约信息",
                            area:["600px","350px"],
                            skin:"layui-layer-molv",
                            content:contentHTML,
                            btn:["确认","取消"],
                            btn1:function(){
                                var info=$("#email-info").val();
                                console.log(info);
                                $.ajax({
                                    dataType:"json",
                                    async:true,
                                    data:{"equipID":equipID,"info":info},
                                    type:"POST",
                                    url:"/equip/equipreservation",
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
                                            location.href=window.location;
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
        	complete:function(){
        		
        	}

        })
	})
})(window,jQuery)

