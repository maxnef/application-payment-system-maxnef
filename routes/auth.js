const express = require("express");
const router = express.Router();
const controller = require("../routeControllers/authController");

router.get("/signin", controller.getSigninPage);
router.get("/signup", controller.getSignupPage);
router.get("/signout", controller.performSignout);
router.post("/signin", controller.performSignin);
router.post("/signup", controller.performSignup);

module.exports = router;