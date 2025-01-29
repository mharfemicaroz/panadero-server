const express = require("express");
const router = express.Router();

const categoryRoutes = require("./categoryRoutes");
const categoryGroupRoutes = require("./categoryGroupRoutes");
const subcategoryRoutes = require("./subcategoryRoutes");
const itemRoutes = require("./itemRoutes");

// Route groups
router.use("/categories", categoryRoutes);
router.use("/category-groups", categoryGroupRoutes);
router.use("/subcategories", subcategoryRoutes);
router.use("/items", itemRoutes);

module.exports = router;
