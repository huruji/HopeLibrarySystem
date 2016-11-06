/*管理员增加书籍的函数*/
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
                var url="/admin/bookmodify-img"+location.href.substring(location.href.lastIndexOf("/"));
                console.log("url:"+url)
                $.ajax({
                    url:url,
                    data:data,
                    type:"POST",
                    contentType:false,
                    processData:false,
                    success:function(response){
                        if(response.code==1){
                            var bookGroup=$.trim($(":radio[name=bookGroup]:checked").parent().text());
                            var bookName=$.trim($("#bookName").val());
                            var hopeID=$.trim($("#hopeID").val());
                            var bookAuthor=$.trim($("#bookAuthor").val());
                            var bookISBN=$.trim($("#bookISBN").val());
                            var bookPress=$.trim($("#bookPress").val());
                            var bookID=$(this).attr("book-data");

                            $.ajax({
                                dataType:"json",
                                async:true,
                                data:{"bookGroup":bookGroup,"bookName":bookName,"hopeID":hopeID,"bookAuthor":bookAuthor,"bookISBN":bookISBN,"bookPress":bookPress,"bookID":bookID},
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
                                    location.assign("/admin/admin-book");
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
            var bookGroup=$.trim($(":radio[name=bookGroup]:checked").parent().text());
        var bookName=$.trim($("#bookName").val());
        var hopeID=$.trim($("#hopeID").val());
        var bookAuthor=$.trim($("#bookAuthor").val());
        var bookISBN=$.trim($("#bookISBN").val());
        var bookPress=$.trim($("#bookPress").val());
        var bookID=$(this).attr("book-data");

        $.ajax({
            dataType:"json",
            async:true,
            data:{"bookGroup":bookGroup,"bookName":bookName,"hopeID":hopeID,"bookAuthor":bookAuthor,"bookISBN":bookISBN,"bookPress":bookPress,"bookID":bookID},
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
                        location.assign("/admin/admin-book");
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