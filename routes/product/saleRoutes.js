const express = require("express");
const router = express.Router();
const saleController = require("@controllers/product/saleController");
const authMiddleware = require("@middleware/authMiddleware");

router.get("/", authMiddleware, saleController.list);
router.post("/", authMiddleware, saleController.create);
router.get("/:id", authMiddleware, saleController.getById);
router.put("/:id", authMiddleware, saleController.update);
router.delete("/:id", authMiddleware, saleController.delete);
router.post("/:id/complete", authMiddleware, saleController.complete);

module.exports = router;
