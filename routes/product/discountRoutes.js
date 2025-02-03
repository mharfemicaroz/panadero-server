const express = require("express");
const router = express.Router();
const discountController = require("@controllers/product/discountController");
const authMiddleware = require("@middleware/authMiddleware");

router.get("/", authMiddleware, discountController.list);
router.post("/", authMiddleware, discountController.create);
router.get("/:id", authMiddleware, discountController.getById);
router.put("/:id", authMiddleware, discountController.update);
router.delete("/:id", authMiddleware, discountController.delete);

module.exports = router;
