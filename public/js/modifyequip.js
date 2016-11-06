/*管理员修改设备的函数*/

(function(global,$){
    var img;
    $("#user-img").change(function(event){
        var file=this.files[this.files.length-1];
        return img={
            imgSrc:$("#user-img").val(),
            file:file
        }
    });
    $("#save").click(function(){
        var equipName=$.trim($("#equipName").val());
        var hopeID=$.trim($("#hopeID").val());
        var equipAdmin=$.trim($("#hopeAdmin").val());
        if(!equipName || !hopeID || !equipAdmin){
            layer.alert("设备名、厚朴编号、管理员为必填",{
                skin:'layui-layer-molv'
            });
            return;
        }
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
                var url="/admin/equipmodify-img"+location.href.substring(location.href.lastIndexOf("/"));
                console.log("url:"+url)
                $.ajax({
                    url:url,
                    data:data,
                    type:"POST",
                    contentType:false,
                    processData:false,
                    success:function(response){
                        if(response.code==1){
                            var equipName=$.trim($("#equipName").val());
                            var hopeID=$.trim($("#hopeID").val());
                            var equipAdmin=$.trim($("#hopeAdmin").val());
                            $.ajax({
                                dataType:"json",
                                data:{"equipName":equipName,"hopeID":hopeID,"equipAdmin":equipAdmin},
                                type:"POST",
                                beforeSend:function(){
                                },
                                success:function(response){
                                        if(response){
                                            var success=response.message;
                    
                                            if(response.code && response.code==2){
                                                layer.alert(success,{
                                                    skin: 'layui-layer-molv',
                                                    closeBtn: 0,
                                                    shift: 2 
                                                });
                                                return;
                                            }else{
                                                layer.alert(success,{
                                                    skin: 'layui-layer-molv',
                                                    closeBtn: 0,
                                                    shift: 2 
                                                });
                                                setTimeout(function(){
                                                    location.assign("/admin/admin-equip");
                                                },500)
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
            var equipName=$.trim($("#equipName").val());
            var hopeID=$.trim($("#hopeID").val());
            var equipAdmin=$.trim($("#hopeAdmin").val());
            $.ajax({
                dataType:"json",
                async:true,
                data:{"equipName":equipName,"hopeID":hopeID,"equipAdmin":equipAdmin},
                type:"POST",
                beforeSend:function(){
                },
                success:function(response){
                    if(response){
                        var success=response.message;
                    
                    if(response.code && response.code==2){
                        layer.alert(success,{
                            skin: 'layui-layer-molv',
                            closeBtn: 0,
                            shift: 2 
                        });
                        return;
                    }else{
                        layer.alert(success,{
                        skin: 'layui-layer-molv',
                        closeBtn: 0,
                        shift: 2 
                    });
                    setTimeout(function(){
                        location.assign("/admin/admin-equip");
                    },500)
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
        })
    }
    });

})(window,jQuery)