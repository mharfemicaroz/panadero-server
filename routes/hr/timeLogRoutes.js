const express = require("express");
const router = express.Router();
const timeLogController = global.requireV2("controllers/hr/timeLogController");

// Time Log routes
router.get("/", timeLogController.list); // Get all time logs
router.post("/", timeLogController.create); // Create a new time log
router.get("/:id", timeLogController.getById); // Get a specific time log
router.put("/:id", timeLogController.update); // Update a time log
router.delete("/:id", timeLogController.delete); // Delete a time log

// Special routes
router.post("/record/:employeeId", timeLogController.recordTimeLog); // Record time in/out
router.get("/daily/:employeeId", timeLogController.getDailyLogs); // Get daily logs for an employee
router.post("/face-verify", timeLogController.faceVerifyTimeLog);

module.exports = router;
