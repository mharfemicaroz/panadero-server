// validations/authValidation.js

const { check } = require("express-validator");

const registerRules = [
  check("username").exists({ checkFalsy: true }).isLength({ min: 3, max: 30 }),
  check("email").exists({ checkFalsy: true }).isEmail(),
  check("password").exists({ checkFalsy: true }).isLength({ min: 6 }),
];

const loginRules = [
  check("email").exists({ checkFalsy: true }).isEmail(),
  check("password").exists({ checkFalsy: true }),
];

const forgotPasswordRules = [
  check("email").exists({ checkFalsy: true }).isEmail(),
];

const resetPasswordRules = [
  check("password").exists({ checkFalsy: true }).isLength({ min: 6 }),
];

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
};
