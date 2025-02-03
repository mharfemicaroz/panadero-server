const express = require("express");
const router = express.Router();
const categoryGroupController = global.requireV2(
  "controllers/product/categoryGroupController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware"); // Import the authMiddleware

// Get all category groups (protected route)
router.get("/", authMiddleware, categoryGroupController.list);

// Create a new category group (protected route)
router.post("/", authMiddleware, categoryGroupController.create);

// Get category group by ID (protected route)
router.get("/:id", authMiddleware, categoryGroupController.getById);

// Update category group (protected route)
router.put("/:id", authMiddleware, categoryGroupController.update);

// Delete category group (protected route)
router.delete("/:id", authMiddleware, categoryGroupController.delete);

module.exports = router;
