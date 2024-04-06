const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const authController = require("../controllers/auth");

router.route("/").get(authController.authenticateToken, cartController.getCart);

router
  .route("/add")
  .post(authController.authenticateToken, cartController.addToCart);

module.exports = router;
