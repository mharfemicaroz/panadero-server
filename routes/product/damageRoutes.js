const express = require("express");
const router = express.Router();
const damageController = global.requireV2(
  "controllers/product/damageController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/", authMiddleware, damageController.list);
router.post("/", authMiddleware, damageController.create);
router.get("/:id", authMiddleware, damageController.getById);
router.put("/:id", authMiddleware, damageController.update);
router.delete("/:id", authMiddleware, damageController.delete);
router.post("/:id/complete", authMiddleware, damageController.complete);

module.exports = router;
