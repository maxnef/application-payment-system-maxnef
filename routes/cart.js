const express = require("express");
const router = express.Router();
const controller = require("../routeControllers/cartController");
const { authRequired } = require("../middlewares/authRequired");

router.get("/", authRequired, controller.getCartPage);
router.post("/add", controller.addProductToCart);
router.post("/delete", controller.deleteProductFromCart);
router.post("/increase", controller.increaseAmountOfProductInCart);
router.post("/decrease", controller.decreaseAmountOfProductInCart);


module.exports = router;