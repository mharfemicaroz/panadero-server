const express = require("express");
const router = express.Router();
const reportController = global.requireV2(
  "controllers/product/reportController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get(
  "/inventory-summary",
  authMiddleware,
  reportController.inventorySummary
);
router.get(
  "/warehouse-utilization",
  authMiddleware,
  reportController.warehouseUtilization
);
router.get("/stock-movements", authMiddleware, reportController.stockMovements);

module.exports = router;
