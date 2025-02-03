const express = require("express");
const router = express.Router();
const subcategoryController = require("@controllers/product/subcategoryController");
const authMiddleware = require("@middleware/authMiddleware");

// Get all subcategories (protected route)
router.get("/", authMiddleware, subcategoryController.list);

// Create a new subcategory (protected route)
router.post("/", authMiddleware, subcategoryController.create);

// Get subcategory by ID (protected route)
router.get("/:id", authMiddleware, subcategoryController.getById);

// Update subcategory (protected route)
router.put("/:id", authMiddleware, subcategoryController.update);

// Delete subcategory (protected route)
router.delete("/:id", authMiddleware, subcategoryController.delete);

module.exports = router;
