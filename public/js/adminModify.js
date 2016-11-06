/*管理员自行修改信息的函数*/
(function(global,$){
    var img;
    $("#user-img").change(function(event){
        var file=this.files[this.files.length-1];
        return img={
            imgSrc:$("#user-img").val(),
            file:file
        }
    })
	$("#save").click(function(){
         var uploadImg=img;
        console.log(uploadImg);
        if(img){
            var fileType=uploadImg.file.type.toLowerCase();
            var fileSize=uploadImg.file.size;
            if(fileType.indexOf("jpeg")<0 && fileType.indexOf("jpg")<0 && fileType.indexOf("png")<0 && fileType.indexOf("gif")<0){
                layer.alert("图片只支持上传jpg,png,gif三种格式",{
                    skin: 'layui-layer-molv'
                })
            }else if(fileSize > 500*1024){
                layer.alert("图片过大，图片大小请控制在500KB以下",{
                    skin:'layui-layer-molv'
                })
            }else{
                var data = new FormData();
                data.append("img",uploadImg.file);
                $.ajax({
                    url:"/admin/modify-img",
                    data:data,
                    type:"POST",
                    contentType:false,
                    processData:false,
                    success:function(response){
                        if(response.code==1){
                            var readerEmail=$.trim($("#readerEmail").val());
                            $.ajax({
                                dataType:"json",
                                data:{"readerEmail":readerEmail},
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
                                        var p=location.pathname,
                                        redirect="/"+p.split("/")[1];
                                        document.location=redirect;
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
                    },
                    error:function(){
                            layer.alert("请求失败",{
                                skin: 'layui-layer-molv',
                                closeBtn: 0,
                                shift: 2 
                            });
                    },
            })
        }
    }else{
        var readerEmail=$.trim($("#readerEmail").val());
        $.ajax({
        dataType:"json",
        data:{"readerEmail":readerEmail},
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
                var p=location.pathname,
                redirect="/"+p.split("/")[1];
                document.location=redirect;
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
	});
})(window,jQuery)