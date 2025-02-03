const express = require("express");
const router = express.Router();
const saleItemController = global.requireV2(
  "controllers/product/saleItemController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/:id", authMiddleware, saleItemController.getById);
router.put("/:id", authMiddleware, saleItemController.update);
router.delete("/:id", authMiddleware, saleItemController.delete);

module.exports = router;
