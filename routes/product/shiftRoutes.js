const express = require("express");
const router = express.Router();
const shiftController = global.requireV2("controllers/product/shiftController");
const authMiddleware = global.requireV2("middleware/authMiddleware"); // Import the auth middleware.

// Get all shifts (protected route)
router.get("/", authMiddleware, shiftController.list);

// Create a new shift (protected route)
router.post("/", authMiddleware, shiftController.create);

// Get a shift by ID (protected route)
router.get("/:id", authMiddleware, shiftController.getById);

// Update a shift (protected route)
router.put("/:id", authMiddleware, shiftController.update);

// Delete a shift (protected route)
router.delete("/:id", authMiddleware, shiftController.delete);

module.exports = router;
