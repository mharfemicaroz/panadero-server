const express = require("express");
const router = express.Router();

const leaveRequestController = global.requireV2(
  "controllers/hr/leaveRequestController"
);
const leaveTypeController = global.requireV2(
  "controllers/hr/leaveTypeController"
);
const leaveBalanceController = global.requireV2(
  "controllers/hr/leaveBalanceController"
);

// LeaveRequest routes
router.post("/requests", leaveRequestController.create); // Create a new leave request
router.get("/requests", leaveRequestController.list); // Retrieve a list of leave requests
router.get("/requests/:id", leaveRequestController.getById); // Retrieve a specific leave request by ID
router.put("/requests/:id", leaveRequestController.update); // Update an existing leave request
router.delete("/requests/:id", leaveRequestController.delete); // Delete a leave request
router.post("/requests/:id/reject", leaveRequestController.reject); // Reject a leave request
router.post("/requests/:id/escalate", leaveRequestController.escalate); // Escalate a leave request

// LeaveType routes
router.post("/types", leaveTypeController.create); // Create a new leave type
router.get("/types", leaveTypeController.list); // Retrieve a list of leave types
router.get("/types/:id", leaveTypeController.getById); // Retrieve a specific leave type by ID
router.put("/types/:id", leaveTypeController.update); // Update an existing leave type
router.delete("/types/:id", leaveTypeController.delete); // Delete a leave type

// LeaveBalance routes
router.post("/balances", leaveBalanceController.create); // Create a new leave balance
router.get("/balances", leaveBalanceController.list); // Retrieve a list of leave balances
router.get("/balances/:id", leaveBalanceController.getById); // Retrieve a specific leave balance by ID
router.put("/balances/:id", leaveBalanceController.update); // Update an existing leave balance
router.delete("/balances/:id", leaveBalanceController.delete); // Delete a leave balance
router.get(
  "/employee/:employeeId/balance",
  leaveBalanceController.getEmployeeLeaveBalance
); // Get leave balance for an employee
router.post(
  "/employee/:employeeId/leave-type/:leaveTypeId/carry-forward",
  leaveBalanceController.carryForward
); // Carry forward leave balance

module.exports = router;
