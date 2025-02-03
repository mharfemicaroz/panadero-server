const express = require("express");
const router = express.Router();
const branchController = require("../../controllers/branch/branchController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, branchController.list);
router.post("/", authMiddleware, branchController.create);
router.get("/:id", authMiddleware, branchController.getById);
router.put("/:id", authMiddleware, branchController.update);
router.delete("/:id", authMiddleware, branchController.delete);

module.exports = router;
