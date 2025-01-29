const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database"); // Your database.js file
const { Sequelize, DataTypes } = require("sequelize");

const db = {};

const loadModels = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      loadModels(filePath);
    } else if (file.endsWith(".js")) {
      const modelInitializer = require(filePath);
      if (typeof modelInitializer === "function") {
        const model = modelInitializer(sequelize, DataTypes);
        db[model.name] = model;
      }
    }
  });
};

// Load models dynamically
loadModels(path.join(__dirname, "product"));
loadModels(path.join(__dirname, "user"));
loadModels(path.join(__dirname, "warehouse"));

// Set up associations after models are loaded
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync database
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized successfully.");
});

module.exports = db;
