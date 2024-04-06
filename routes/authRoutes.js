const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authController.login);

router.route("/profile").get(authController.authenticateToken);

router.route("/refresh").post(authController.refreshToken);

// router.route('/refresh')
//     .get(authController.refresh)

router.route("/logout").post(authController.logout);

module.exports = router;
