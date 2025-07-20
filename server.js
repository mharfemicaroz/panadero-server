"use strict";

// Load environment variables and module alias
require("dotenv").config();
require("module-alias/register");

// Set timezone
process.env.TZ = "Asia/Manila";

// Core & External Dependencies
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const xssClean = require("xss-clean");

// Global Require Helper
global.requireV2 = (relativePath) => {
  return require(path.join(process.cwd(), relativePath));
};

// Local Dependencies
const securityHeaders = global.requireV2("middleware/securityHeaders");
const { loadFaceApiModels } = require("./loadFaceApiModels");
const db = require("./models");

// Routes
const authRoutes = require("./routes/auth/authRoutes");
const userRoutes = require("./routes/user/userRoutes");
const productRoutes = require("./routes/product");
const warehouseRoutes = require("./routes/warehouse/warehouseRoutes");
const customerRoutes = require("./routes/customer/customerRoutes");
const branchRoutes = require("./routes/branch/branchRoutes");
const hrRoutes = require("./routes/hr");
const productivityRoutes = require("./routes/productivity");

// Initialize
const app = express();
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(xssClean());
app.use(securityHeaders());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(bodyParser.json());

const corsOptions = {
  origin: ["http://localhost:5173", "https://panadero.area51.ph"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Database Sync
(async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing the database:", error.message);
  }
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/productivity", productivityRoutes);

// Face API Models
loadFaceApiModels()
  .then(() => console.log("Face API models loaded successfully"))
  .catch((err) => console.error("Face API models failed to load:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
