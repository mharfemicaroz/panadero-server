const express = require("express");
const router = express.Router();
const procurementController = require("../../controllers/product/procurementController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, procurementController.list);
router.post("/", authMiddleware, procurementController.create);
router.get("/:id", authMiddleware, procurementController.getById);
router.put("/:id", authMiddleware, procurementController.update);
router.delete("/:id", authMiddleware, procurementController.delete);
router.post("/:id/complete", authMiddleware, procurementController.complete);

module.exports = router;
