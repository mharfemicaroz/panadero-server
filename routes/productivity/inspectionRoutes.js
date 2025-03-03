const express = require("express");
const router = express.Router();
const inspectionController = global.requireV2(
  "controllers/productivity/inspectionController"
);

// Basic CRUD
router.get("/", inspectionController.list); // GET /inspections
router.post("/", inspectionController.create); // POST /inspections
router.get("/:id", inspectionController.getById); // GET /inspections/:id
router.put("/:id", inspectionController.update); // PUT /inspections/:id
router.delete("/:id", inspectionController.delete); // DELETE /inspections/:id

// Questions & Responses
router.post("/:id/questions", inspectionController.addQuestion); // POST /inspections/:id/questions
router.post("/:id/responses", inspectionController.addResponse); // POST /inspections/:id/responses

// Issues
router.post("/:id/issues", inspectionController.addIssue); // POST /inspections/:id/issues
router.put("/issues/:issueId", inspectionController.updateIssue); // PUT /inspections/issues/:issueId

module.exports = router;
