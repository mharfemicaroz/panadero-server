const express = require("express");
const router = express.Router();
const projectController = global.requireV2(
  "controllers/productivity/projectController"
);

// Basic CRUD for Projects
router.get("/", projectController.list); // GET /projects
router.post("/", projectController.create); // POST /projects
router.get("/:id", projectController.getById); // GET /projects/:id
router.put("/:id", projectController.update); // PUT /projects/:id
router.delete("/:id", projectController.delete); // DELETE /projects/:id

// Create a Task under a specific Project
router.post("/:id/tasks", projectController.createTask);

module.exports = router;
