const express = require("express");
const router = express.Router();
const supplierController = global.requireV2(
  "controllers/product/supplierController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/", authMiddleware, supplierController.list);
router.post("/", authMiddleware, supplierController.create);
router.get("/:id", authMiddleware, supplierController.getById);
router.put("/:id", authMiddleware, supplierController.update);
router.delete("/:id", authMiddleware, supplierController.delete);

module.exports = router;
