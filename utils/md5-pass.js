const crypto = require('crypto');


function md5Pass(value) {
    var sha=crypto.createHash("md5");
    sha.update(value);
    var password_md5=sha.digest("hex");
    return password_md5;
}
module.exports = md5Pass;