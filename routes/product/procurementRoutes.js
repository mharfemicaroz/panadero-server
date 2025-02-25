const express = require("express");
const router = express.Router();
const procurementController = global.requireV2(
  "controllers/product/procurementController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/", authMiddleware, procurementController.list);
router.post("/", authMiddleware, procurementController.create);
router.get("/:id", authMiddleware, procurementController.getById);
router.put("/:id", authMiddleware, procurementController.update);
router.delete("/:id", authMiddleware, procurementController.delete);
router.put("/:id/complete", authMiddleware, procurementController.complete);

module.exports = router;
