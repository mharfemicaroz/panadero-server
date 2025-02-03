const express = require("express");
const router = express.Router();
const returnController = require("@controllers/product/returnController");
const authMiddleware = require("@middleware/authMiddleware");

router.get("/", authMiddleware, returnController.list);
router.post("/", authMiddleware, returnController.create);
router.get("/:id", authMiddleware, returnController.getById);
router.put("/:id", authMiddleware, returnController.update);
router.delete("/:id", authMiddleware, returnController.delete);
router.post("/:id/complete", authMiddleware, returnController.complete);

module.exports = router;
