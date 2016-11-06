/*管理员增加书籍的函数*/
(function(global,$){
    $("#user-img").change(function(event){
        var file=this.files[this.files.length-1];
        var uploadImg={
            imgSrc:$("#user-img").val(),
            file:file
        };
        if(uploadImg){
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
                    url:"/admin/bookadd-img",
                    data:data,
                    type:"POST",
                    contentType:false,
                    processData:false,
                    success:function(response){
                        console.log("a");
                        if(response.src){
                            var img='<img src="'+response.src+'">';
                            $(".upload-user-img").prepend(img);
                            $("#user-img").css("position","relative");
                        }
                    },
                    error:function(){
                            layer.alert("图片上传失败",{
                                skin: 'layui-layer-molv',
                                closeBtn: 0,
                                shift: 2 
                            });
                    },
                })
            }
        }
    })
    $("#save").click(function(){
        var bookGroup=$.trim($(":radio[name=bookGroup]:checked").parent().text());
        var bookName=$.trim($("#bookName").val());
        var hopeID=$.trim($("#hopeID").val());
        var bookAuthor=$.trim($("#bookAuthor").val());
        var bookISBN=$.trim($("#bookISBN").val());
        var bookPress=$.trim($("#bookPress").val());
        var bookID=$(this).attr("book-data");
        if($(".upload-user-img img")[0]){
            var bookImgSrc=$(".upload-user-img img")[0].src;
        }else{
            var bookImgSrc="";
        }
        if(!bookGroup || !bookName || !hopeID){
            layer.alert("图书名、厚朴编号、分类为必填！",{
                skin: 'layui-layer-molv',
                closeBtn: 0,
                shift: 2 
            });
            return;
        }
        console.log("aaaa");
        $.ajax({
            dataType:"json",
            async:true,
            data:{"bookGroup":bookGroup,"bookName":bookName,"hopeID":hopeID,"bookAuthor":bookAuthor,"bookISBN":bookISBN,"bookPress":bookPress,"bookID":bookID,"bookImgSrc":bookImgSrc},
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
                        location.assign("/admin");
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
    });
})(window,jQuery)