var hajax = {
    ajax: function(cfg){
        $.ajax({
            dataType:"json",
            async:true,
            data:cfg.data || {},
            url: cfg.url || '',
            type:cfg.type || "POST",
            beforeSend:function() {
                cfg.beforeFn && cfg.beforeFn();
            },
            success:function(res){
                if(cfg.successFn){
                    cfg.successFn(res);
                } else{
                    var message = res.message;
                    hlayer.alert({
                        text:message,
                        time:2000,
                        mainBg:'#1c95ea',
                        icon:1
                    });
                    var redirect = cfg.redirect || '/';
                    var redirectTime = cfg.redirectTime || 1500;
                    cfg.redirect && setTimeout(function(){
                      location.assign(redirect);
                    },redirectTime);
                }
            },
            error:function(){
                if(cfg.errorFn) {
                    cfg.errorFn();
                }else {
                    hlayer.alert({
                        text: '请求失败',
                        time:2000,
                        mainBg:'#1c95ea',
                        icon:2
                    });
                }
            },
            complete:function(){
                cfg.completeFn && cfg.completeFn();
            }
        });
    },
    hformAjax: function(cfg) {
        var input = cfg.input || {};
        var radio = cfg.radio || {};
        var attr = cfg.attr || {};
        cfg.data = cfg.data || {};
        for(var key in input) {
            cfg.data[key] = $.trim($('#' + input[key]).val());
        }
        for(var key in radio) {
            cfg.data[key] = $.trim($(':radio[name=' + radio[key] + ']:checked').parent().text());
        }
        for(var key in attr) {
            cfg.data[key] = $.trim($('#' + attr[key][0]).attr(attr[key][1]));
        }
        console.log(12345);
        console.log(cfg.data);
        this.ajax(cfg);
    }
};