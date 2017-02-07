function hajax(cfg) {
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
            cfg.successFn &&　cfg.successFn(res);
        },
        error:function(){
            cfg.errorFn　&& cfg.errorFn();
        },
        complete:function(){
            cfg.completeFn && cfg.completeFn();
        }
    });
}
function hformAjax(cfg) {
    // attr: {book:[id,attr]}
    var input = cfg.input || {};
    var radio = cfg.radio || {};
    var attr = cfg.attr || {};
    for(var key in input) {
        cfg.data[key] = $.trim($('#' + input[key]).val());
    }
    for(var key in radio) {
        cfg.data[key] = $.trim($(':radio[name=' + radio[key] + ']:checked').parent().text());
    }
    for(var key in attr) {
        cfg.data[key] = $.trim($('#' + attr[key][0]).attr(attr[key][1]));
    }
    hajax(cfg);
}