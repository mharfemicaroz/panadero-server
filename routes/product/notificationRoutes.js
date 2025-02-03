const express = require("express");
const router = express.Router();
const notificationController = require("@controllers/product/notificationController");
const authMiddleware = require("@middleware/authMiddleware");

router.get("/", authMiddleware, notificationController.list);
router.put("/:id/read", authMiddleware, notificationController.markAsRead);

module.exports = router;
