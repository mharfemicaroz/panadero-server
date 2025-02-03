const express = require("express");
const router = express.Router();
const userController = global.requireV2("controllers/user/userController");
const authMiddleware = global.requireV2("middleware/authMiddleware"); // Import the authMiddleware

// Get all users (protected route)
router.get("/", authMiddleware, userController.list);

// Create a new user (no authentication required for registration)
router.post("/", userController.create);

// Get user by ID (protected route)
router.get("/:id", authMiddleware, userController.getById);

// Update user (protected route)
router.put("/:id", authMiddleware, userController.update);

// Delete user (protected route)
router.delete("/:id", authMiddleware, userController.delete);

module.exports = router;
