
(function(global,$){
	$(".js-borrow-btn").click(function(){
        var equipID=$(this).attr("data-reservationID");
	    hajax.ajax({
            data:{"equipID":equipID},
            url:"/equip/equipemail",
            successFn:function(res){
                var text = '你预约的设备是' + res.equipName + '，管理员是' + res.adminName + '，请填写你需要发送给管理员的信息(如：取设备的时间，需要的配件），可为空';
                hlayer.prompt({
                    title:'预约信息',
                    text: text,
                    formType: 3,
                    height: '350px',
                    width: '500px',
                    mainBg:'#1c95ea',
                    confirmCb: function(value){
                        console.log(value);
                        hajax.ajax({
                            data:{"equipID":equipID,"info":value},
                            url:'/equip/equipreservation',
                            redirect:window.location,
                        })
                    }
                })
            }
        });
	})
})(window,jQuery);

