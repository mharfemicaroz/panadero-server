const express = require("express");
const router = express.Router();
const categoryController = global.requireV2(
  "controllers/product/categoryController"
);
const subcategoryController = global.requireV2(
  "controllers/product/subcategoryController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

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
//add

module.exports = router;
