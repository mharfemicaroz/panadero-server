const express = require("express");
const router = express.Router();

const inspectionRoutes = require("./inspectionRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");

router.use("/inspections", inspectionRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
