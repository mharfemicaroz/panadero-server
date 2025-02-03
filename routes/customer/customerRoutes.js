const express = require("express");
const router = express.Router();
const customerController = require("@controllers/customer/customerController");
const authMiddleware = require("@middleware/authMiddleware"); // If authentication is required

// List all customers
router.get("/", authMiddleware, customerController.list);

// Create a new customer
router.post("/", authMiddleware, customerController.create);

// Get a customer by ID
router.get("/:id", authMiddleware, customerController.getById);

// Update a customer by ID
router.put("/:id", authMiddleware, customerController.update);

// Delete a customer by ID
router.delete("/:id", authMiddleware, customerController.delete);

module.exports = router;
