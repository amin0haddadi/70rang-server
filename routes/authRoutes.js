const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authController.login);

router.route("/profile").get(authController.authenticateToken, (req, res) => {
  // Access user information from req.user
  const { id, firstName, lastName, phoneNumber } = req.user;
  res.status(200).json({ id, firstName, lastName, phoneNumber });
});

router.route("/refresh").post(authController.refreshToken);

// router.route('/refresh')
//     .get(authController.refresh)

router.route("/logout").post(authController.logout);

module.exports = router;
