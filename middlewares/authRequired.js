const jwt = require("jsonwebtoken");

/* This function decode the cookie and control it */
const authRequired = function(req, res, next) {
    const token = req.cookies.clientCookie;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {
            if (err) {
                res.redirect("/auth/signin");
            } else {
                res.locals.clientData = decodedToken;
                next();
            }
        });
    } else {
        res.redirect("/auth/signin");
    }
}

module.exports = { authRequired };