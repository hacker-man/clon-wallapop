var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");

exports.createToken = function(user) {
    var payload = {
        sub: user._id || user.id,
        rol: user.rol,
        email: user.email,
        name: user.name,
        iat: moment().unix(),
        exp: moment().add(14, "days").unix(),
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
};
