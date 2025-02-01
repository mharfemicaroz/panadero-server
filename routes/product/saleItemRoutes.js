const express = require("express");
const router = express.Router();
const saleItemController = require("../../controllers/product/saleItemController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/:id", authMiddleware, saleItemController.getById);
router.put("/:id", authMiddleware, saleItemController.update);
router.delete("/:id", authMiddleware, saleItemController.delete);

module.exports = router;
