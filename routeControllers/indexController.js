/* Index route driver function(s) */
const Product = require("../models/Product");

function getHomePage(req, res) {
    let count = 0;
    req.session.cart.forEach(x => {
        count += x[1];
    });
    Product.find({}).then(function(response) {
        res.render("index", {
            products: response,
            cartCount: count,
            cookies: req.cookies,
        });
    }).catch(function(error) {
        res.status(500).send(error);
    });
}

module.exports = { getHomePage }