const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/product/categoryController");
const subcategoryController = require("../../controllers/product/subcategoryController");
const authMiddleware = require("../../middleware/authMiddleware");

// Get all categories
router.get("/", authMiddleware, categoryController.list);

// Create a new category
router.post("/", authMiddleware, categoryController.create);

// Get category by ID
router.get("/:id(\\d+)", authMiddleware, categoryController.getById);

// Update category
router.put("/:id(\\d+)", authMiddleware, categoryController.update);

// Delete category
router.delete("/:id(\\d+)", authMiddleware, categoryController.delete);

// Get all subcategories of a category
router.get(
  "/:id/subcategories",
  authMiddleware,
  subcategoryController.listByCategory
);

router.get("/showall", categoryController.showAll);

module.exports = router;
