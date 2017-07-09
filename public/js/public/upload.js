define('upload', ['jquery', 'hlayer'], function($, hlayer) {
    return function() {
      $("#js-upload-input").change(function(event){
        var file=this.files[this.files.length-1];
        var img={
          imgSrc:$("#js-upload-input").val(),
          file:file
        };
        var fileType = img.file.type.toLowerCase();
        var fileSize = img.file.size;
        if(fileType.indexOf("jpeg")<0 && fileType.indexOf("jpg")<0 && fileType.indexOf("png")<0 && fileType.indexOf("gif")<0){
          hlayer.alert({
            text:'图片只支持上传jpg,png,gif三种格式',
            time:2000,
            mainBg:'#1c95ea',
            icon:2
          });
        }else if(fileSize > 500*1024){
          hlayer.alert({
            text:'图片过大，图片大小请控制在500KB以下',
            time:2000,
            mainBg:'#1c95ea',
            icon:2
          });
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
              hlayer.msg({
                text:'上传成功',
                icon:1
              });
            }
          })
        }
      });
    }
});