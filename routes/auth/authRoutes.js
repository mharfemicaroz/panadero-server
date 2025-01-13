const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");

// Register a new user
router.post("/register", authController.register);
// Login an existing user
router.post("/login", authController.login);
// Logout the user (client will delete the token)
router.post("/logout", authController.logout);
// Forgot password (request password reset token)
router.post("/forgot-password", authController.forgotPassword);
// Reset password with reset token
router.post("/reset-password", authController.resetPassword);

module.exports = router;
