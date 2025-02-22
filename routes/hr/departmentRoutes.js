const express = require("express");
const router = express.Router();
const departmentController = global.requireV2(
  "controllers/hr/departmentController"
);

// Department routes
router.post("/", departmentController.create); // Create a new department
router.get("/", departmentController.list); // Retrieve a list of departments
router.get("/:id", departmentController.getById); // Retrieve a specific department by ID
router.put("/:id", departmentController.update); // Update an existing department
router.delete("/:id", departmentController.delete); // Delete a department

module.exports = router;
