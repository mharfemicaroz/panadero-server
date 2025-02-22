const express = require("express");
const router = express.Router();
const deductionController = global.requireV2(
  "controllers/hr/deductionController"
);

// Deduction routes
router.post("/", deductionController.create); // Create a new deduction
router.get("/", deductionController.list); // Retrieve a list of deductions
router.get("/:id", deductionController.getById); // Retrieve a specific deduction by ID
router.put("/:id", deductionController.update); // Update an existing deduction
router.delete("/:id", deductionController.delete); // Delete a deduction

module.exports = router;
