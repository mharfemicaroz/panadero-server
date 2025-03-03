const express = require("express");
const router = express.Router();

// Controllers
const authController = global.requireV2("controllers/auth/authController");

// Middlewares
const authMiddleware = global.requireV2("middleware/authMiddleware");
const throttle = global.requireV2("middleware/throttle");

// Validations (example)
const { registerRules, loginRules, forgotPasswordRules, resetPasswordRules } =
  global.requireV2("validations/authValidation");
const { validate } = global.requireV2("middleware/validate");

// Authentication Routes
router.post(
  "/register",
  throttle(5, 60 * 60 * 1000), // e.g., allow 5 attempts per hour
  registerRules,
  validate,
  authController.register
);

router.post(
  "/login",
  throttle(100, 15 * 60 * 1000), // e.g., allow 10 login attempts per 15 minutes
  loginRules,
  validate,
  authController.login
);

router.post("/logout", authMiddleware, authController.logout);

router.post(
  "/forgot-password",
  throttle(5, 60 * 60 * 1000),
  forgotPasswordRules,
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  throttle(5, 60 * 60 * 1000),
  resetPasswordRules,
  validate,
  authController.resetPassword
);

router.post("/refresh", authController.refresh);

// 2FA Routes
// Typically, you want the user to be authenticated before enabling, disabling, or verifying 2FA
router.post("/enable-2fa", authMiddleware, authController.enable2FA);
router.post("/disable-2fa", authMiddleware, authController.disable2FA);
router.post("/verify-2fa", authMiddleware, authController.verify2FA);

module.exports = router;
