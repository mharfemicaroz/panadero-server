const express = require("express");
const router = express.Router();
const attendanceController = global.requireV2(
  "controllers/hr/attendanceController"
);

// Standard CRUD routes
router.get("/", attendanceController.list); // Get all attendance records
router.post("/", attendanceController.create); // Create a new attendance record
router.get("/:id", attendanceController.getById); // Get a specific attendance record
router.put("/:id", attendanceController.update); // Update an attendance record
router.delete("/:id", attendanceController.delete); // Delete an attendance record

// Special routes for attendance computation and daily records
router.get("/daily/:employeeId", attendanceController.getDailyAttendance); // Get daily attendance with time logs
router.post("/compute/:employeeId", attendanceController.computeAttendance); // Compute/recompute attendance from time logs

module.exports = router;
