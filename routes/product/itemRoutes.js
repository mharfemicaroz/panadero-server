const express = require("express");
const router = express.Router();
const itemController = global.requireV2("controllers/product/itemController");
const authMiddleware = global.requireV2("middleware/authMiddleware");

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
