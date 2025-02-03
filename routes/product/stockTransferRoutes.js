const express = require("express");
const router = express.Router();
const stockTransferController = require("@controllers/product/stockTransferController");
const authMiddleware = require("@middleware/authMiddleware");

// List all stock transfers (protected route)
router.get("/", authMiddleware, stockTransferController.list);

// Create a new stock transfer (protected route)
router.post("/", authMiddleware, stockTransferController.create);

// Get a stock transfer by ID (protected route)
router.get("/:id", authMiddleware, stockTransferController.getById);

// Update a stock transfer (protected route)
router.put("/:id", authMiddleware, stockTransferController.update);

// Delete a stock transfer (protected route)
router.delete("/:id", authMiddleware, stockTransferController.delete);

// Complete transfer (protected route) - explicitly sets status to "completed" & adjusts inventory
router.post("/:id/complete", authMiddleware, stockTransferController.complete);

module.exports = router;
