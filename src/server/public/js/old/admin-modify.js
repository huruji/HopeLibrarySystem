/*管理员自行修改信息的函数*/
(function(global,$){
    $("#save").click(function() {
        var readerEmail = $.trim($("#readerEmail").val());
        var readerImgSrc = $('#js-upload-img').attr('src');
        $.ajax({
            dataType: "json",
            data: {"readerEmail": readerEmail,'readerImgSrc': readerImgSrc},
            type: "POST",
            success: function (response) {
                if (response) {
                    var success = response.message;
                }
                layer.alert(success, {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    shift: 2
                });
                setTimeout(function () {
                    var p = location.pathname,
                        redirect = "/" + p.split("/")[1];
                    document.location = redirect;
                }, 500)
            },
            error: function () {
                layer.alert("请求失败", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    shift: 2
                });
            }
        });
    });
})(window,jQuery);