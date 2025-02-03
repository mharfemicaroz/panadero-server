const express = require("express");
const router = express.Router();
const itemController = require("../../controllers/product/itemController");
const authMiddleware = require("../../middleware/authMiddleware");

// Get all items
router.get("/", authMiddleware, itemController.list);

// Create a new item (with inventory creation)
router.post("/", authMiddleware, itemController.create);

// Get an item by ID
router.get("/:id", authMiddleware, itemController.getById);

// Update an item
router.put("/:id", authMiddleware, itemController.update);

// Delete an item
router.delete("/:id", authMiddleware, itemController.delete);

module.exports = router;
