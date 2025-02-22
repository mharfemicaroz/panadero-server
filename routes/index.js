const express = require("express");
const app = express();

// Import employee, department, and job title routes
const employeeRoutes = require("./hr/employeeRoutes");
const departmentRoutes = require("./hr/departmentRoutes");
const jobTitleRoutes = require("./hr/jobTitleRoutes");

// Use employee, department, and job title routes
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/job-titles", jobTitleRoutes);

module.exports = app;
