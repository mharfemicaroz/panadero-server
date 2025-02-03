const express = require("express");
const router = express.Router();
const pricingController = global.requireV2(
  "controllers/product/pricingController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/", authMiddleware, pricingController.list);
router.post("/", authMiddleware, pricingController.create);
router.get("/:id", authMiddleware, pricingController.getById);
router.put("/:id", authMiddleware, pricingController.update);
router.delete("/:id", authMiddleware, pricingController.delete);

module.exports = router;
