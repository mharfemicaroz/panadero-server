const express = require("express");
const router = express.Router();

const categoryRoutes = require("./categoryRoutes");
const categoryGroupRoutes = require("./categoryGroupRoutes");
const subcategoryRoutes = require("./subcategoryRoutes");
const itemRoutes = require("./itemRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const stockTransferRoutes = require("./stockTransferRoutes");
const orderRoutes = require("./orderRoutes");
const orderItemRoutes = require("./orderItemRoutes");
const supplierRoutes = require("./supplierRoutes");
const procurementRoutes = require("./procurementRoutes");
const reportRoutes = require("./reportRoutes");
const notificationRoutes = require("./notificationRoutes");
const returnRoutes = require("./returnRoutes");
const damageRoutes = require("./damageRoutes");
const pricingRoutes = require("./pricingRoutes");
const discountRoutes = require("./discountRoutes");
const saleRoutes = require("./saleRoutes");
const saleItemRoutes = require("./saleItemRoutes");
const stockMovementRoutes = require("./stockMovementRoutes");
const shiftRoutes = require("./shiftRoutes");
const cashRegisterRoutes = require("./cashRegisterRoutes");

// Route groups
router.use("/categories", categoryRoutes);
router.use("/category-groups", categoryGroupRoutes);
router.use("/subcategories", subcategoryRoutes);
router.use("/items", itemRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/stock-transfers", stockTransferRoutes);
router.use("/orders", orderRoutes);
router.use("/order-items", orderItemRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/procurements", procurementRoutes);
router.use("/reports", reportRoutes);
router.use("/notifications", notificationRoutes);
router.use("/returns", returnRoutes);
router.use("/damages", damageRoutes);
router.use("/pricing", pricingRoutes);
router.use("/discounts", discountRoutes);
router.use("/sales", saleRoutes);
router.use("/sale-items", saleItemRoutes);
router.use("/stockmovements", stockMovementRoutes);
router.use("/shifts", shiftRoutes);
router.use("/cash-registers", cashRegisterRoutes);

module.exports = router;
