const express = require("express");
const router = express.Router();
const userController = global.requireV2("controllers/user/userController");
const authMiddleware = global.requireV2("middleware/authMiddleware");
const roleCheck = global.requireV2("middleware/roleCheck");
const throttle = global.requireV2("middleware/throttle");
const { createUserRules, updateUserRules } = global.requireV2(
  "validations/userValidation"
);
const { validate } = global.requireV2("middleware/validate");

router.get("/", authMiddleware, userController.list);
router.post("/", createUserRules, validate, userController.create);
router.get("/:id", authMiddleware, userController.getById);
router.put(
  "/:id",
  authMiddleware,
  updateUserRules,
  validate,
  userController.update
);
router.delete(
  "/:id",
  authMiddleware,
  roleCheck(["admin", "manager"]),
  throttle(10, 60 * 60 * 1000),
  userController.delete
);

module.exports = router;
