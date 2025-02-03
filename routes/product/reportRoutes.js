const express = require("express");
const router = express.Router();
const reportController = require("../../controllers/product/reportController");
const authMiddleware = require("../../middleware/authMiddleware");

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
