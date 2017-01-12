function checkLogin(req, res, next, sessionKeyArray, redirectUrl) {
    var needRedirect = false;
    if(req.path.indexOf('login') > -1) {
        next();
        return;
    }
    for(var i = 0, max = sessionKeyArray.length; i < max; i++) {
        if(!req.session[sessionKeyArray[i]]){
            needRedirect = true;
            return;
        }
    }
    if(needRedirect) {
        res.redirect(redirectUrl);
        return;
    }
    next();
}

module.exports = checkLogin;