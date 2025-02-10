// routes/product/itemRoutes.js
const express = require("express");
const router = express.Router();
const itemController = global.requireV2("controllers/product/itemController");
const authMiddleware = global.requireV2("middleware/authMiddleware");

// New route for listing items with history — place it before "/:id" routes
router.get("/with-history", authMiddleware, itemController.listWithHistory);

// Existing routes
router.get("/", authMiddleware, itemController.list);
router.post("/", authMiddleware, itemController.create);
router.get("/:id", authMiddleware, itemController.getById);
router.put("/:id", authMiddleware, itemController.update);
router.delete("/:id", authMiddleware, itemController.delete);

module.exports = router;
