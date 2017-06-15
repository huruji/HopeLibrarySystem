var hlayer = {
    docBody: document.body,
    mainBg:'#51B1D9',
    mainColor: '#fff',
    data:{},
    setData: function(key,value) {
        this.data[key] = value;
    },
    addStyle: function() {
        var _this = this;
        var scripts = document.getElementsByTagName('script');
        var hlayerSrc = '';
        for(var i = 0, max = scripts.length; i < max; i++) {
            if(scripts[i].getAttribute('src') !== null && scripts[i].getAttribute('src').toString().indexOf('hlayer.js') > -1){
                hlayerSrc = scripts[i].getAttribute('src');
            }
            console.log(scripts[i]);
        }
        console.log(hlayerSrc);
        var styleSrc = hlayerSrc.replace('hlayer.js', 'hlayer.css');
        var link = this.creEle('link');
        link.setAttribute('href', styleSrc);
        link.setAttribute('rel','stylesheet');
        console.log(styleSrc);
        document.getElementsByTagName('head')[0].appendChild(link);
        return link;
    },
    css: function(ele, cssJson) {
        for(var key in cssJson){
            ele.style[key] = cssJson[key];
        }
    },
    creEle: function(ele,cl,id) {
        var e = document.createElement(ele);
        if(cl) {
            e.className = cl;
        }
        if(id) {
            e.id = id;
        }
        return e;
    },
    rmEle: function(eleArr, parArr) {
        for(var i = 0, max = eleArr.length; i < max; i++) {
            parArr[i].removeChild(eleArr[i]);
        }
    },
    creHlayer: function(){
        var preLayer = document.getElementsByClassName('hlayer');
        var id = 0;
        if(preLayer.length > 0){
            var preId = preLayer[preLayer.length -1].getAttribute('id').toString().replace(/\D/g,'');
            console.log(preId);
            id = Number(preId) + 1;
        }
        var ele = this.creEle('div','hlayer hlayer' + id,'hlayer' + id );
        this.css(ele, {display:'block',position:'fixed',width:'100%',height:'100%'});
        this.appendNodes(this.docBody, ele);
        return ele;
    },
    rmHlayer: function(layer) {
        this.docBody.removeChild(layer);
    },
    getStyle: function(ele, attr) {
        if(ele.currentStyle) {
            return ele.currentStyle[attr];
        }
        return getComputedStyle(ele, false)[attr];
    },
    posCenter: function(child, parent) {
        var childWid = parseInt(this.getStyle(child, 'width'));
        console.log(childWid);
        var childHei = parseInt(this.getStyle(child, 'height'));
        console.log(childHei);
        var parentWid = parseInt(this.getStyle(parent, 'width'));
        console.log(parentWid);
        var parentHei = parseInt(this.getStyle(parent, 'height'));
        console.log(parentHei);
        var setTop = (parentHei - childHei) / 2 + 'px';
        var setLeft = (parentWid - childWid) / 2 + 'px';
        this.css(child, {position:'fixed',top:setTop,left:setLeft});
    },
    position: function(child, parent, type) {
        var _this = this;
        var type = type || 0;
        var childWid = parseInt(this.getStyle(child, 'width'));
        var childHei = parseInt(this.getStyle(child, 'height'));
        var parentWid = parseInt(this.getStyle(parent, 'width'));
        var parentHei = parseInt(this.getStyle(parent, 'height'));
        var setTop, setLeft, setBottom, setRight;
        this.css(child, {position:'fixed'});
        if(type === 0) {
            setTop = (parentHei - childHei) / 2 + 'px';
            setLeft = (parentWid - childWid) / 2 + 'px';
            _this.css(child,{top:setTop,left:setLeft});
        } else if(type === 1){
            setTop = '0px';
            setLeft = '0px';
            _this.css(child,{top:setTop,left:setLeft});
        } else if(type === 2) {
            setTop = '0px';
            setLeft = (parentWid - childWid) / 2 + 'px';
            _this.css(child,{top:setTop,left:setLeft});
        } else if(type === 3) {
            setTop = '0px';
            setRight = '0px';
            _this.css(child,{top:setTop,right:setRight});
        } else if(type === 4) {
            setBottom = '0px';
            setLeft = '0px';
            _this.css(child,{bottom:setBottom,left:setLeft});
        } else if(type === 5) {
            setBottom = '0px';
            setRight = (parentWid - childWid) / 2 + 'px';
            _this.css(child,{bottom:setBottom,right:setRight});
        } else if(type === 6) {
            setBottom = '0px';
            setRight = '0px';
            _this.css(child,{bottom:setBottom,right:setRight});
        }
    },
    addEvent: function(ele, event, fn){
        if(ele.attachEvent) {
            return ele.attachEvent('on' + event, fn);
        }
        return ele.addEventListener(event, fn, false);
    },
    timingCancel: function(time,hlayer) {
        time = time || 1000;
        var _this = this;
        setTimeout(function() {
            _this.rmHlayer(hlayer);
        }, time);
    },
    center: function(ele) {
        var childWid = parseInt(this.getStyle(ele, 'width'));
        console.log(childWid);
        var childHei = parseInt(this.getStyle(ele, 'height'));
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        var setTop = (winHeight - childHei) / 2 + 'px';
        var setLeft = (winWidth - childWid) / 2 + 'px';
        this.css(ele, {position:'fixed',top:setTop,left:setLeft});
    },
    appendNodes: function(par, childArr) {
        if(Array.isArray(childArr)) {
            for (var i = 0, max = childArr.length; i < max; i++) {
                par.appendChild(childArr[i]);
            }
        }else{
            par.appendChild(childArr);
        }
    },
    creShadow: function(layer) {
        var shadow = this.creEle('div');
        shadow.className = 'hlayer-shadow';
        this.css(shadow, {position: 'fixed',top:0,left:0,width: '100%',height:'100%',backgroundColor:'#000',opacity:'0.3',zIndex: 10000});
        layer.appendChild(shadow);
        return shadow;
    },
    creMsg: function(cfg) {
        var msgCon = this.creEle('div','hlayer-msg');
        var msgContent = this.creEle('div','hlayer-msg-content');
        msgContent.textContent = cfg.text;
        if(cfg.animateType && typeof cfg.animateType === "number") {
            msgCon.className += ' hlayer-animate' + cfg.animateType;
        }
        this.css(msgCon, {height:cfg.height,lineHeight:cfg.height});
        if(cfg.width) {
            this.css(msgCon, {width: cfg.width});
        }
        this.css(msgCon,{minWidth:'60px',padding: '5px',borderRadius:'3px',display:'inline-block',background:'#fff',zIndex:10010,border:'1px solid #999',boxShadow:'0px 0px 10px #777'});
        this.css(msgContent, {fontSize:'14px'});
        this.appendNodes(msgCon,msgContent);
        if(cfg.icon && typeof cfg.icon === 'number') {
            var icon = this.creIcon(cfg.icon);
            this.appendNodes(msgCon,icon);
            this.css(msgCon, {paddingLeft:'48px'});
        }
        if(cfg.css) {
            this.css(msgCon,css);
        }
        cfg.parent.appendChild(msgCon);
        return msgCon;
    },
    creBtn: function(options) {
        var options = options || {};
      var right = options.right || '10px';
      var bottom = options.bottom || '10px';
      var text = options.text || '确定';
      var btn = this.creEle('span');
      this.css(btn, {width:'44px',height:'30px',lineHeight:'30px', cursor:'pointer',textAlign:'center',backgroundColor:options.mainBg, color: options.mainColor, borderRadius:'3px', padding:'0 8px',position:'absolute',right:right,bottom: bottom});
      if(options.css) {
          this.css(btn, options.css);
      }
      btn.textContent = text;
      return btn;
    },
    creAlert: function(cfg) {
        var _this = this;
      var alertCon = this.creEle('div','hlayer-alert');
      if(cfg.animateType && typeof cfg.animateType === "number") {
          alertCon.className += ' hlayer-animate' + cfg.animateType;
      }
      var alertTitle = this.creEle('div','hlayer-alert-title');
      var alertContent = this.creEle('div', 'hlayer-alert-content');
      this.css(alertCon,{width:cfg.width,height:cfg.height});
      this.css(alertCon, {borderRadius: '5px',backgroundColor:'#fff',zIndex:10010,boxShadow:'0 0 10px #777'});
      this.css(alertTitle, {height:'42px', padding: '0 10px', borderRadius:'5px 5px 0px 0px',lineHeight: '42px',fontSize: '16px',backgroundColor:cfg.mainBg,color:cfg.mainColor});
      alertTitle.textContent = cfg.title;
      this.css(alertContent, {height:'70px',padding: '18px 10px',fontSize: '14px',lineHeight: '20px'});
      alertContent.textContent = cfg.text;
      this.appendNodes(alertCon, [alertTitle, alertContent]);
      if(cfg.confirmBtn !== false) {
          var btn  = this.creBtn({mainBg:cfg.mainBg,mainColor:cfg.mainColor});
          alertCon.appendChild(btn);
          this.addEvent(btn,'click',function() {
              _this.rmHlayer(cfg.parent);
              cfg.confirmCb && cfg.confirmCb();
          })
      }
      if(cfg.cancelBtn === true) {
          var btn = this.creBtn({text:'取消',mainBg:cfg.mainBg,mainColor:cfg.mainColor,css:{left:'10px'}});
          alertCon.appendChild(btn);
          this.addEvent(btn,'click',function() {
              _this.rmHlayer(cfg.parent);
              cfg.cancelCb && cfg.cancelCb();
          })
      }
        if(cfg.icon && typeof cfg.icon === 'number') {
            var icon = this.creIcon(cfg.icon);
            this.appendNodes(alertContent,icon);
            this.css(alertContent, {paddingLeft:'48px'});
        }
        cfg.parent.appendChild(alertCon);
      return alertCon;
    },
    creLoad: function(cfg) {
        var loadCon = this.creEle('div');
        if(typeof cfg.type === 'number') {
            loadCon.className = 'hlayer-load' + ' hlayer-load' + cfg.type;
            if(cfg.type === 1){
                var loadContent = this.creEle('div', 'load-content');
                for (var i = 0; i < 8; i++) {
                    var div = this.creEle('div');
                    loadContent.appendChild(div);
                }
                loadCon.appendChild(loadContent);
            }
        }
        if(cfg.animateType && typeof cfg.animateType === "number") {
            loadCon.className += ' hlayer-animate' + cfg.animateType;
        }
        this.css(loadCon, {width: cfg.width, height: cfg.height, backgroundColor:'rgba(0,0,0,0.3)', boxShadow:'0px 0px solid #777',borderRadius:'5px'});
        this.css(loadCon, {zIndex: 10010});
        cfg.parent.appendChild(loadCon);
        return loadCon;
    },
    creIcon: function(type){
        var iconCon = this.creEle('div','hlayer-icon');
        iconCon.className += ' hlayer-icon' + type;
        var i = this.creEle('i');
        this.appendNodes(iconCon,i);
        return iconCon;
    },
    creIframe: function(cfg) {
        var title = cfg.title || '信息';
        var width = cfg.width;
        var height = cfg.height;
        var iframeCon = this.creEle('div');
        this.css(iframeCon,{padding: '10px', width: width, height: height,zIndex:10010,position:'fixed',backgroundColor:'#eee',borderRadius:'5px',boxShadow:'0px 0px 10px #777'});
        var iframeTitle = this.creEle('div');
        iframeTitle.textContent = title;
        this.css(iframeTitle, {height:'32px',lineHeight:'32px',fontSize:'14px',borderBottom:'1px solid #333'});
        var iframeContent = this.creEle('div');
        var iframe = this.creEle('iframe');
        this.css(iframe, {display: 'block', width:'100%', height: parseInt(height)- 33 + 'px', borderWidth: 0});
        iframe.src = cfg.url;
        this.appendNodes(iframeContent,[iframe]);
        this.appendNodes(iframeCon, [iframeTitle, iframeContent]);
        var closeBtn = this.creCloseBtn();
        this.appendNodes(iframeCon,[closeBtn]);
        if(cfg.animateType && typeof cfg.animateType === "number") {
            iframeCon.className += ' hlayer-animate' + cfg.animateType;
        }
        var _this = this;
        this.addEvent(closeBtn, 'click', function () {
            _this.rmHlayer(cfg.parent);
        });
        cfg.parent.appendChild(iframeCon);
        return iframeCon;
    },
    creCloseBtn:function() {
        var closeCon = this.creEle('div');
        var icon1 = this.creEle('span');
        var icon2 = this.creEle('span');
        this.css(closeCon,{position:'absolute', right: '10px',top:'10px',height:'20px',width:'20px', cursor:'pointer',border:'1px solid #000'});
        this.appendNodes(closeCon, [icon1,icon2]);
        this.css(icon1,{width:'2px',height:'28px',transform:'rotate(45deg)',position:'absolute',left:'9px',top:'-4px',background:'#000'});
        this.css(icon2,{width:'2px',height:'28px',transform:'rotate(-45deg)',position:'absolute',left:'9px',top:'-4px',background:'#000'});
        return closeCon;
    },
    /*cfg:{
        text: '内容'，
        css: {msg盒子的css样式组成的json},
        width: 宽度,
        height: 高度,
        time: msg消失的时间，毫秒计，默认为1s,
        position:位置，默认为屏幕中间,
        icon:1,
        animateType:动画类型1,2，3中的一种,
        shadow:是否需要遮罩层,默认为false
      }
    */
    msg: function(cfg) {
        var cfg = cfg || {};
        cfg.width = cfg.width || '';
        cfg.height =  cfg.height || '40px';
        cfg.text = cfg.text || '提示信息';
        cfg.time = cfg.time || 1000;
        console.log('time:' + cfg.time);
        cfg.css = cfg.css || '';
        cfg.position = cfg.position || 0;
        cfg.animateType = cfg.animateType || 3;
        var layer = this.creHlayer();
        cfg.parent = layer;
        if(cfg.shadow && cfg.shadow === true){
            var shadow = this.creShadow();
        }
        var msgCon = this.creMsg(cfg);
        this.position(msgCon, layer, cfg.position);
        if(cfg.css) {
            this.css(msgCon, cfg.css);
        }
        this.timingCancel(cfg.time, layer);
    },
    /*
    cfg:{
        mainBg: 主要的背景颜色,
        mainColor: 主要的字体颜色,
        title: alert框的标题,
        text: alert框的内容,
        width: 宽度,
        height: 高度,
        confirmBtn: 是否需要确认按钮，默认为true,
        confirmCb: 点击确认按钮时触发的事件函数,
        cancelBtn: 是否需要取消按钮，默认为false,
        cancelCb: 点击取消按钮时触发的事件函数,
        animateType:动画类型1,2，3中的一种,
        position:位置，默认为屏幕中间,
        shadow:是否需要遮罩，默认为true，
        time: alert消失的时间，毫秒计，默认为false,也就是不自动消失,
     }
    */
    alert: function(cfg) {
        var cfg = cfg || {};
        cfg.mainBg = cfg.mainBg || this.mainBg;
        cfg.mainColor = cfg.mainColor || this.mainColor;
        cfg.title = cfg.title || '信息';
        cfg.text = cfg.text || '提示信息';
        cfg.width = cfg.width || '260px';
        cfg.height = cfg.height || '148px';
        cfg.confirmBtn = cfg.confirmBtn || true;
        cfg.cancelBtn = cfg.cancelBtn || false;
        cfg.animateType = cfg.animateType || 3;
        cfg.position = cfg.position || 0;
        var layer = this.creHlayer();
        cfg.parent = layer;
        if(cfg.shadow !== false){
            var shadow = this.creShadow(layer);
        }
        var alertCon = this.creAlert(cfg);
        this.position(alertCon,layer,cfg.position);
        if(cfg.time && typeof cfg.time === 'number') {
            this.timingCancel(cfg.time, layer);
        }
    },
    /*
    cfg:{
        type:类型，
        width:宽度,
        height:高度,
        time:时间,
        position:位置，默认为屏幕中间,
        shadow:是否需要遮罩，默认为true，
        time: alert消失的时间，毫秒计，默认为1s,
        type:loading的类型,
        animateType:动画类型1,2，3中的一种,
    }
    */
    loading: function(cfg) {
        var cfg = cfg || {};
        cfg.type = cfg.type || 1;
        cfg.width = cfg.width || '100px';
        cfg.height = cfg.height || '100px';
        cfg.position = cfg.position || 0;
        cfg.animateType = cfg.animateType || 3;
        var layer = this.creHlayer();
        cfg.parent = layer;
        if(cfg.shadow !== false){
            var shadow = this.creShadow(layer);
        }
        var loadCon = this.creLoad(cfg);
        this.position(loadCon,layer,cfg.position);
        if(cfg.time) {
            this.timingCancel(cfg.time,layer);
        }
    },
    /*cfg:{
        title:'标题',
        width:宽度,
        height:高度,
     animateType:动画类型1,2，3中的一种,
    }
    */
    iframe: function(cfg) {
        var cfg = cfg || {};
        cfg.width = cfg.width || '700px';
        cfg.height = cfg.height || '486px';
        cfg.position = cfg.position || 0;
        var layer = this.creHlayer();
        cfg.parent = layer;
        if(cfg.shadow !== false){
            var shadow = this.creShadow(layer);
        }
        cfg.position = cfg.position || 0;
        cfg.animateType = cfg.animateType || 3;
        var iframeCon = this.creIframe(cfg);
        this.position(iframeCon,layer,cfg.position);
    },
    /*cfg:{
        mainBg: 主要的背景颜色,
        mainColor: 主要的字体颜色,
        title: alert框的标题,
        text: alert框的内容,
        width: 宽度,
        height: 高度,
        confirmBtn: 是否需要确认按钮，默认为true,
        confirmCb: 点击确认按钮时触发的事件函数,
        cancelBtn: 是否需要取消按钮，默认为false,
        cancelCb: 点击取消按钮时触发的事件函数,
        animateType:动画类型1,2，3中的一种,
        position:位置，默认为屏幕中间,
        shadow:是否需要遮罩，默认为true，
        time: alert消失的时间，毫秒计，默认为false,也就是不自动消失,
    }*/
    crePrompt: function(cfg){
        var _this = this;
        var promptCon = this.creEle('div','hlayer-prompt');
        if(cfg.animateType && typeof cfg.animateType === "number") {
            promptCon.className += ' hlayer-animate' + cfg.animateType;
        }
        var promptTitle = this.creEle('div','hlayer-prompt-title');
        var promptContent = this.creEle('div', 'hlayer-prompt-content');
        cfg.parent.appendChild(promptCon);
        this.appendNodes(promptCon, [promptTitle, promptContent]);
        this.css(promptCon,{width:cfg.width,height:cfg.height});
        this.css(promptCon, {borderRadius: '5px',backgroundColor:'#fff',zIndex:10010,boxShadow:'0 0 10px #777'});
        this.css(promptTitle, {height:'42px', padding: '0 10px', borderRadius:'5px 5px 0px 0px',lineHeight: '42px',fontSize: '16px',backgroundColor:cfg.mainBg,color:cfg.mainColor});
        promptTitle.textContent = cfg.title;
        this.css(promptContent, {height:'70px',padding: '18px 10px',fontSize: '14px',lineHeight: '20px'});
        if(cfg.text){
            var promptText = this.creEle('div', 'hlayer-prompt-content-text');
            promptText.textContent = cfg.text;
            this.css(promptText,{textIndent:'2em',fontSize:'14px',lineHeight:'20px'});
            promptContent.appendChild(promptText);
        }
        var input;
        if(cfg.formType === 1){
            input = this.creEle('input');
            input.type = 'text';
            promptContent.appendChild(input);
            this.css(input,{display:'block',width: '100%',height:'36px', padding:'6px 5px',boxSizing:'border-box',border:'1px solid #aaa',borderRadius:'3px'});
        } else if(cfg.formType === 2){
            input = this.creEle('input');
            input.type = 'password';
            promptContent.appendChild(input);
            this.css(input,{display:'block',width: '100%',height: '36px', padding:'6px 5px',boxSizing:'border-box',border:'1px solid #aaa',borderRadius:'3px'});
        } else if(cfg.formType === 3) {
            input = this.creEle('textarea');
            promptContent.appendChild(input);
            var height = parseInt(cfg.height) - 108 + 'px';
            console.log(height);
            if(promptText){
                height = parseInt(height) - parseInt(this.getStyle(promptText,'height')) + 'px';
                console.log('height2' +height);
            }
            this.css(input,{display:'block',width: '100%',height:height, padding:'6px 5px',boxSizing:'border-box',border:'1px solid #aaa',borderRadius:'3px'});
        }
        if(cfg.confirmBtn !== false) {
            var btn  = this.creBtn({mainBg:cfg.mainBg,mainColor:cfg.mainColor});
            promptCon.appendChild(btn);
            this.addEvent(btn,'click',function() {
                _this.rmHlayer(cfg.parent);
                var value = input.value;
                console.log(value);
                cfg.confirmCb && cfg.confirmCb(value);
            });
        }
        if(cfg.cancelBtn === true) {
            var btn = this.creBtn({text:'取消',mainBg:cfg.mainBg,mainColor:cfg.mainColor,css:{left:'10px'}});
            promptCon.appendChild(btn);
            this.addEvent(btn,'click',function() {
                _this.rmHlayer(cfg.parent);
                cfg.cancelCb && cfg.cancelCb();
            })
        }
        return promptCon;
    },
    prompt: function(cfg){
        var cfg = cfg || {};
        cfg.mainBg = cfg.mainBg || this.mainBg;
        cfg.mainColor = cfg.mainColor || this.mainColor;
        cfg.title = cfg.title || '信息';
        cfg.text = cfg.text || '提示信息';
        cfg.width = cfg.width || '260px';
        cfg.height = cfg.height || '148px';
        cfg.confirmBtn = cfg.confirmBtn || true;
        cfg.cancelBtn = cfg.cancelBtn || true;
        cfg.animateType = cfg.animateType || 3;
        cfg.position = cfg.position || 0;
        cfg.formType = cfg.formType || 1;
        cfg.data = '';
        var layer = this.creHlayer();
        cfg.parent = layer;
        if(cfg.shadow !== false){
            var shadow = this.creShadow(layer);
        }
        var promptCon = this.crePrompt(cfg);
        this.position(promptCon,layer,cfg.position);
        if(cfg.time && typeof cfg.time === 'number') {
            this.timingCancel(cfg.time, layer);
        }
    }
};