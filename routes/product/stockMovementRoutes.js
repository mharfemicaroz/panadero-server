const express = require("express");
const router = express.Router();
const stockMovementController = global.requireV2(
  "controllers/product/stockMovementController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

// CRUD routes for stock movements
router.get("/", authMiddleware, stockMovementController.list);
router.post("/", authMiddleware, stockMovementController.create);
router.get("/:id", authMiddleware, stockMovementController.getById);
router.put("/:id", authMiddleware, stockMovementController.update);
router.delete("/:id", authMiddleware, stockMovementController.delete);

module.exports = router;
