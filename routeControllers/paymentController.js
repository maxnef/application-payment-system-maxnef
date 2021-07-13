/* Payment route driver function(s) */
const paypal = require("paypal-rest-sdk");
const Order = require("../models/Order");
const Client = require("../models/Client");
const Product = require("../models/Product");

paypal.configure({
    "mode": "sandbox", //This project aims self-learning.
    "client_id": process.env.PAYPAL_CLIENT_ID,
    "client_secret": process.env.PAYPAL_SECRET_KEY,
});


async function setPayment(req, res, next) {
    //Match cart product with Product object and using them to create paypal item.
    const cart_detail = await create_cart_detail(req);

    paypal.payment.create(create_payment_json(cart_detail.items, cart_detail.total),
        function(error, payment) {
            if (error) {
                throw error; //Hope that sentry won't see that X_X
            } else {
                payment.links.forEach(url => {
                    if (url.rel === "approval_url") {
                        res.redirect(url.href);
                    }
                });
            }
        });
}

async function donePayment(req, res, next) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const cart_detail = await create_cart_detail(req);

    paypal.payment.execute(paymentId, execute_payment_json(payerId, cart_detail.total),
        async function(error, payment) {
            if (error) {
                throw error; // Also that :)
            } else {
                //Create an order and add it to client model.
                let thisClient = await Client.findOne({ email: res.locals.clientData.email });

                //Add to client's orders
                let tempOrder = new Order({
                    paymentId: payment.cart,
                    date: payment.create_time,
                    status: payment.state,
                    total: cart_detail.total,
                });
                let products = [];
                let productAmounts = [];
                //Try to reach product data by using product's name (paypal item object).
                cart_detail.items.forEach(async x => {
                    let p = await Product.findOne({ "name": x.name });
                    products.push(p._id);
                    productAmounts.push(x.quantity);
                });

                //Process client and order objects step by step.
                await thisClient.orders.push(tempOrder._id);
                await thisClient.save();
                await tempOrder.save();
                await Order.findOneAndUpdate({ "_id": tempOrder._id }, { products: products });
                await Order.findOneAndUpdate({ "_id": tempOrder._id }, { productAmounts: productAmounts });

                //At the end of all process, redirect the client to account page
                //Order history can be seen in here.
                req.session.destroy(); //To have empty cart.
                res.render("redirect", {
                    cookies: req.cookies,
                    message: "Payment done! Thanks for choosing us...",
                });
            }
        });
}

async function create_cart_detail(req) {
    //Get informations from cart (in session)
    let cart = req.session.cart;
    let items = [];
    let total = 0;
    let products = await Product.find({});

    cart.forEach(cartProduct => {
        let product = products.find(p => p._id == cartProduct[0]);
        items.push(create_item_json(product, cartProduct[1]));
        total += product.price * cartProduct[1];
    });
    return {
        items: items,
        total: total,
    };
}

//JSON prototypes

function create_payment_json(items, total) {
    return {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal",
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/payment/done",
            "cancel_url": "http://localhost:3000/cart",
        },
        "transactions": [{
            "item_list": {
                "items": items,
            },
            "amount": {
                "currency": "USD",
                "total": `${total}`,
            },
            "description": "Feel free to pay...",
        }],
    };
}

function create_item_json(product, quantity) {
    return {
        "name": `${product.name}`,
        "sku": "item",
        "price": `${product.price}`,
        "currency": `${product.currency}`,
        "quantity": `${quantity}`,
    };
}

function execute_payment_json(payerId, total) {
    return {
        "payer_id": `${payerId}`,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": `${total}`,
            }
        }],
    };
}

module.exports = { setPayment, donePayment };