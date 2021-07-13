/* Account route driver function(s) */
const Order = require("../models/Order");
const Client = require("../models/Client");
const Product = require("../models/Product");

function getAccountPage(req, res, next) {
    //Get the client who has sent email
    Client.findOne({ "email": res.locals.clientData.email }).exec().then((p) => {
        let clientOrders = p.orders;
        let returnOrders = [];

        //For each order inside the client's order element
        for (let i = 0; i < clientOrders.length; i++) {
            //Get the real order according to id param of the client's order element
            Order.findOne({ "_id": clientOrders[i] })
                .exec()
                .then(
                    (tempOrderObject) => {
                        //The products inside the order --- find real products according to id params
                        Product.find({
                            '_id': { $in: tempOrderObject.products }
                        }, function(err, products) {
                            if (err) {
                                throw err; //Sentry, do not try to catch this -_-
                            }
                            tempOrderObject.products = products;
                            returnOrders.push(tempOrderObject);

                            //At the end, returnOrders contain order informations with include specific product data.
                            if (i + 1 === clientOrders.length) {
                                res.render("account", {
                                    cookies: req.cookies,
                                    orders: returnOrders,
                                });
                            }
                        });
                    }
                );
        }
    });
}


module.exports = { getAccountPage }