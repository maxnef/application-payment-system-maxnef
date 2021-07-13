/* Auth route driver function(s) */
const Client = require("../models/Client");
const jwt = require("jsonwebtoken")


function getSigninPage(req, res) {
    res.render("signin", {
        cookies: req.cookies,
    });
}

function getSignupPage(req, res) {
    res.render("signup", {
        cookies: req.cookies,
    });
}


function performSignin(req, res) {
    //Find the client according to email and process with that information...
    Client.findOne({ email: req.body.email }, function(err, client) {
        if (err || !client) {
            //If client is not found -> email must be incorrect
            res.json("Email is incorrect!");
        } else {

            client.comparePassword(req.body.password, function(err, isMatch) {
                if (err || !isMatch) {
                    res.json("Password is incorrect!");
                } else {
                    const token = jwt.sign({
                        email: client.email,
                    }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 15 });
                    res.cookie("clientCookie", token, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 15,
                    });
                    res.json("success");
                }
            });
        }
    });
}

function performSignup(req, res) {

    let client = new Client({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
    });

    client.save()
        .then(res.json("success"))
        .catch((err) => {
            res.json("Check your credentials...")
        });
}

function performSignout(req, res) {
    res.cookie("clientCookie", "", { maxAge: 1 });
    req.session.destroy();
    res.redirect("/");
}

module.exports = { getSignupPage, getSigninPage, performSignin, performSignup, performSignout };