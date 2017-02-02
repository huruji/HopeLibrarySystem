/*管理员自行修改信息的函数*/
(function(global,$){
    $("#user-img").change(function(event){
        var file=this.files[this.files.length-1];
        var img={
            imgSrc:$("#user-img").val(),
            file:file
        };
        var fileType = img.file.type.toLowerCase();
        var fileSize = img.file.size;
        if(fileType.indexOf("jpeg")<0 && fileType.indexOf("jpg")<0 && fileType.indexOf("png")<0 && fileType.indexOf("gif")<0){
            layer.alert("图片只支持上传jpg,png,gif三种格式",{
                skin: 'layui-layer-molv'
            })
        }else if(fileSize > 500*1024){
            layer.alert("图片过大，图片大小请控制在500KB以下",{
                skin:'layui-layer-molv'
            })
        }else {
            var data = new FormData();
            data.append("img", img.file);
            $.ajax({
                url: "/temp/img",
                data: data,
                type: "POST",
                contentType: false,
                processData: false,
                success: function(res) {
                    $('#js-upload-img').attr('src', res.imgSrc);
                },
                complete:function() {
                    layer.msg('上传成功',{
                        icon: 1,
                        time:500
                    });
                }
            })
        }
    });
})(window,jQuery);