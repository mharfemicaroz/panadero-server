const express = require("express");
const router = express.Router();

const employeeRoutes = require("./employeeRoutes");
const departmentRoutes = require("./departmentRoutes");
const jobTitleRoutes = require("./jobTitleRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const deductionRoutes = require("./deductionRoutes");
const allowanceRoutes = require("./allowanceRoutes");
const salaryRoutes = require("./salaryRoutes");
const payrollRoutes = require("./payrollRoutes");
const leaveRoutes = require("./leaveRoutes");
const timelogRoutes = require("./timeLogRoutes");

router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/job-titles", jobTitleRoutes);
router.use("/attendances", attendanceRoutes);
router.use("/deductions", deductionRoutes);
router.use("/allowances", allowanceRoutes);
router.use("/salaries", salaryRoutes);
router.use("/payrolls", payrollRoutes);
router.use("/leaves", leaveRoutes);
router.use("/timelogs", timelogRoutes);

module.exports = router;
