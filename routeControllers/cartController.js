/* Cart route driver function(s) */
const Product = require("../models/Product");


function getCartPage(req, res, next) {
    const cart = req.session.cart;

    //Get all products
    Product.find({}, function(err, products) {
        if (err) {
            res.send("CART PAGE ERROR");
        }
        let cartProducts = [];

        products.forEach(p => {
            //Product and cart object (which is product id) matched.
            const c = cart.find(element => p._id == element[0]);

            if (c) {
                cartProducts.push([p, c[1]]); //0 -> Product data, 1 -> Product amount
            }
        });
        res.render("cart", {
            cookies: req.cookies,
            products: cartProducts,
        });
    });
}

// ADD, DELETE, INCREASE, DECREASE function are using req.session to get/set product values.

function addProductToCart(req, res, next) {
    //Skip control statements, other conditions are handled.
    let exists = req.session.cart.find(x => x[0] == req.body.product_id);

    if (exists) {
        let pIndex = req.session.cart.findIndex(x => x[0] == req.body.product_id);
        req.session.cart[pIndex][1]++;
    } else {
        req.session.cart.push([req.body.product_id, 1]);
    }

    let count = 0;
    req.session.cart.forEach(x => {
        count += x[1];
    });

    res.send(`${count}`);
}

function deleteProductFromCart(req, res, next) {
    //Skip control statements, other conditions are handled.
    let pIndex = req.session.cart.findIndex(x => x[0] === req.body.product_id);
    if (req.session.cart.length === 1 && req.session.cart[0][0] == req.body.product_id) {
        req.session.cart = [];
    } else {
        req.session.cart.splice(pIndex, 1);
    }
    res.status(200).json("deleted");
}

function increaseAmountOfProductInCart(req, res, next) {
    //Skip control statements, other conditions are handled.
    let pIndex = req.session.cart.findIndex(x => x[0] == req.body.product_id);
    req.session.cart[pIndex][1]++;
    res.status(200).json("increased");
}

function decreaseAmountOfProductInCart(req, res, next) {
    //Skip control statements, other conditions are handled.
    let pIndex = req.session.cart.findIndex(x => x[0] == req.body.product_id);
    req.session.cart[pIndex][1]--;
    res.status(200).json("decreased");
}

module.exports = { getCartPage, addProductToCart, deleteProductFromCart, increaseAmountOfProductInCart, decreaseAmountOfProductInCart };