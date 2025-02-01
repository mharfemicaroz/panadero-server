const express = require("express");
const router = express.Router();
const orderItemController = require("../../controllers/product/orderItemController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/:id", authMiddleware, orderItemController.getById);
router.put("/:id", authMiddleware, orderItemController.update);
router.delete("/:id", authMiddleware, orderItemController.delete);

module.exports = router;
