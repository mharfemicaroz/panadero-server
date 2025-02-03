const express = require("express");
const router = express.Router();
const orderItemController = global.requireV2(
  "controllers/product/orderItemController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/:id", authMiddleware, orderItemController.getById);
router.put("/:id", authMiddleware, orderItemController.update);
router.delete("/:id", authMiddleware, orderItemController.delete);

module.exports = router;
