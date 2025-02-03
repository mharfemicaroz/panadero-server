const express = require("express");
const router = express.Router();
const pricingController = require("@controllers/product/pricingController");
const authMiddleware = require("@middleware/authMiddleware");

router.get("/", authMiddleware, pricingController.list);
router.post("/", authMiddleware, pricingController.create);
router.get("/:id", authMiddleware, pricingController.getById);
router.put("/:id", authMiddleware, pricingController.update);
router.delete("/:id", authMiddleware, pricingController.delete);

module.exports = router;
