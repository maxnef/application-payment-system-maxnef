const express = require("express");
const router = express.Router();
const controller = require("../routeControllers/paymentController");
const { authRequired } = require("../middlewares/authRequired");

router.get("/", authRequired, controller.setPayment);
router.get("/done", authRequired, controller.donePayment);

module.exports = router;