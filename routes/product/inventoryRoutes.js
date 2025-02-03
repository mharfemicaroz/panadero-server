const express = require("express");
const router = express.Router();
const inventoryController = require("../../controllers/product/inventoryController");
const authMiddleware = require("../../middleware/authMiddleware");

/**
 * Inventory Routes
 */

// List all inventory records
router.get("/", authMiddleware, inventoryController.list);

// Create a new inventory record
router.post("/", authMiddleware, inventoryController.create);

// Get a specific inventory record by ID
router.get("/:id", authMiddleware, inventoryController.getById);

// Update an inventory record by ID
router.put("/:id", authMiddleware, inventoryController.update);

// Delete an inventory record by ID
router.delete("/:id", authMiddleware, inventoryController.delete);

// Adjust quantity (IN or OUT)
router.patch(
  "/:id/adjust-quantity",
  authMiddleware,
  inventoryController.adjustQuantity
);

module.exports = router;
