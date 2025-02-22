const express = require("express");
const router = express.Router();
const allowanceController = global.requireV2(
  "controllers/hr/allowanceController"
);

// Allowance routes
router.post("/", allowanceController.create); // Create a new allowance
router.get("/", allowanceController.list); // Retrieve a list of allowances
router.get("/:id", allowanceController.getById); // Retrieve a specific allowance by ID
router.put("/:id", allowanceController.update); // Update an existing allowance
router.delete("/:id", allowanceController.delete); // Delete an allowance

module.exports = router;
