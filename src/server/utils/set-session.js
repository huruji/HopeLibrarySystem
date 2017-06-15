function setSession(req,options) {
    for(let a in options) {
        req.session[a] = options[a];
    }
}

module.exports = setSession;