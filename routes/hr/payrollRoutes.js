const express = require("express");
const router = express.Router();
const payrollController = global.requireV2("controllers/hr/payrollController");

// Standard CRUD routes
router.get("/", payrollController.list); // Get all payroll records
router.post("/", payrollController.create); // Create a new payroll record
router.get("/:id", payrollController.getById); // Get a specific payroll record
router.put("/:id", payrollController.update); // Update a payroll record
router.delete("/:id", payrollController.delete); // Delete a payroll record

// Special routes for payroll processing
router.post("/calculate", payrollController.calculatePayroll); // Calculate payroll without saving
router.post("/generate", payrollController.generatePayroll); // Calculate and save payroll
router.post("/:id/approve", payrollController.approvePayroll); // Approve a payroll record
router.post("/:id/mark-paid", payrollController.markAsPaid); // Mark payroll as paid

module.exports = router;
