const express = require("express");
const router = express.Router();
const notificationController = global.requireV2(
  "controllers/product/notificationController"
);
const authMiddleware = global.requireV2("middleware/authMiddleware");

router.get("/", authMiddleware, notificationController.list);
router.put("/:id/read", authMiddleware, notificationController.markAsRead);

module.exports = router;
