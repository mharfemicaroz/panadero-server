const express = require("express");
const router = express.Router();
const taskController = global.requireV2(
  "controllers/productivity/taskController"
);

// Basic CRUD for Tasks
router.get("/", taskController.list); // GET /tasks
router.post("/", taskController.create); // POST /tasks
router.get("/:id", taskController.getById); // GET /tasks/:id
router.put("/:id", taskController.update); // PUT /tasks/:id
router.delete("/:id", taskController.delete); // DELETE /tasks/:id

// Comments
router.post("/:id/comments", taskController.addComment);

module.exports = router;
