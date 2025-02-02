const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refresh);

// 2FA Routes
router.post("/enable-2fa", authController.enable2FA);
router.post("/disable-2fa", authController.disable2FA);
router.post("/verify-2fa", authController.verify2FA);

module.exports = router;
