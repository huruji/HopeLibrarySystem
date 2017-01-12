function setSession(req,options) {
    for(var a in options) {
        req.session[a] = options[a];
    }
}

module.exports = setSession;