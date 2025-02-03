const express = require("express");
const router = express.Router();
const warehouseController = global.requireV2(
  "controllers/warehouse/warehouseController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

// Get all warehouses (protected route)
router.get("/", authMiddleware, warehouseController.list);

// Create a new warehouse (protected route)
router.post("/", authMiddleware, warehouseController.create);

// Get warehouse by ID (protected route)
router.get("/:id", authMiddleware, warehouseController.getById);

// Update warehouse (protected route)
router.put("/:id", authMiddleware, warehouseController.update);

// Delete warehouse (protected route)
router.delete("/:id", authMiddleware, warehouseController.delete);

module.exports = router;
