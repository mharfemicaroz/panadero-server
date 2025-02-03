const express = require("express");
const router = express.Router();
const orderController = global.requireV2("controllers/product/orderController");
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/", authMiddleware, orderController.list);
router.post("/", authMiddleware, orderController.create);
router.get("/:id", authMiddleware, orderController.getById);
router.put("/:id", authMiddleware, orderController.update);
router.delete("/:id", authMiddleware, orderController.delete);
router.post("/:id/complete", authMiddleware, orderController.complete);

module.exports = router;
