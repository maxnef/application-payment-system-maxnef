const express = require("express");
const router = express.Router();
const controller = require("../routeControllers/accountController");
const { authRequired } = require("../middlewares/authRequired");

router.get("/", authRequired, controller.getAccountPage);

module.exports = router;