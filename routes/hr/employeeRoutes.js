const express = require("express");
const router = express.Router();
const employeeController = global.requireV2(
  "controllers/hr/employeeController"
);

// Employee routes
router.post("/", employeeController.create); // Create a new employee
router.get("/", employeeController.list); // Retrieve a list of employees
router.get("/:id", employeeController.getById); // Retrieve a specific employee by ID
router.put("/:id", employeeController.update); // Update an existing employee
router.delete("/:id", employeeController.delete); // Delete an employee

module.exports = router;
