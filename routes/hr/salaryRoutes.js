const express = require("express");
const router = express.Router();
const salaryController = global.requireV2("controllers/hr/salaryController");

// Standard CRUD routes
router.get("/", salaryController.list); // Get all salary records
router.post("/", salaryController.create); // Create a new salary record
router.get("/:id", salaryController.getById); // Get a specific salary record
router.put("/:id", salaryController.update); // Update a salary record
router.delete("/:id", salaryController.delete); // Delete a salary record

// Special routes
router.get("/employee/:employeeId/current", salaryController.getCurrentSalary); // Get employee's current salary
router.get("/employee/:employeeId/history", salaryController.getSalaryHistory); // Get employee's salary history
router.post("/calculate-rates", salaryController.calculateRates); // Calculate salary rates

module.exports = router;
