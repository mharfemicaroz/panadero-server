const path = require("path");

global.requireV2 = (relativePath) => {
  return require(path.join(process.cwd(), relativePath));
};
// Set the timezone to Philippine time (Asia/Manila)
process.env.TZ = "Asia/Manila";

const { loadFaceApiModels } = require("./loadFaceApiModels");

// Load environment variables
require("dotenv").config();
require("module-alias/register");

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const useroutes = require("./routes/user/userRoutes");
const authRoutes = require("./routes/auth/authRoutes");
const productRoutes = require("./routes/product");
const warehouseRoutes = require("./routes/warehouse/warehouseRoutes");
const customerRoutes = require("./routes/customer/customerRoutes");
const branchRoutes = require("./routes/branch/branchRoutes");
const hrRoutes = require("./routes/hr");
const db = require("./models");

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: ["http://localhost:5173", "https://panadero.area51.ph"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

(async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing the database:", error.message);
  }
})();

app.use("/api/auth", authRoutes);
app.use("/api/users", useroutes);
app.use("/api/product", productRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/hr", hrRoutes);

loadFaceApiModels()
  .then(() => console.log("Face API models loaded successfully"))
  .catch((err) => console.error("Face API models failed to load:", err));

app.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});
