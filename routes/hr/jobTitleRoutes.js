const express = require("express");
const router = express.Router();
const jobTitleController = global.requireV2(
  "controllers/hr/jobTitleController"
);
// Job Title routes
router.post("/", jobTitleController.create); // Create a new job title
router.get("/", jobTitleController.list); // Retrieve a list of job titles
router.get("/:id", jobTitleController.getById); // Retrieve a specific job title by ID
router.put("/:id", jobTitleController.update); // Update an existing job title
router.delete("/:id", jobTitleController.delete); // Delete a job title

module.exports = router;
