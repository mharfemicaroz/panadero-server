const express = require("express");
const router = express.Router();
const cashRegisterController = global.requireV2(
  "controllers/product/cashRegisterController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware"); // Import the auth middleware.

// Get all cash register entries (protected route)
router.get("/", authMiddleware, cashRegisterController.list);

// Create a new cash register entry (protected route)
router.post("/", authMiddleware, cashRegisterController.create);

// Get a cash register entry by ID (protected route)
router.get("/:id", authMiddleware, cashRegisterController.getById);

// Update a cash register entry (protected route)
router.put("/:id", authMiddleware, cashRegisterController.update);

// Delete a cash register entry (protected route)
router.delete("/:id", authMiddleware, cashRegisterController.delete);

module.exports = router;
