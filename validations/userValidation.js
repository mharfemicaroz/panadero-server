// validations/userValidation.js
const { body } = require("express-validator");

// Create user validation rules
exports.createUserRules = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .trim()
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars")
    .trim(),
];

// Update user validation rules
exports.updateUserRules = [
  body("username")
    .optional()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .trim()
    .escape(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required")
    .trim()
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("At least 6 chars")
    .trim(),
];
