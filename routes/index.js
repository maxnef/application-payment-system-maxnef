const express = require("express");
const router = express.Router();
const controller = require("../routeControllers/indexController");


router.get("/", controller.getHomePage);


module.exports = router;