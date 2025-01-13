// Load environment variables
require("dotenv").config();

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const useroutes = require("./routes/user/userRoutes");
const authRoutes = require("./routes/auth/authRoutes");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173", "https://panadero.area51.ph"],
  methods: ["GET", "POST", "PUT", "DELETE"],
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

app.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});
