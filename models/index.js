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
      const model = require(filePath)(sequelize, DataTypes);
      db[model.name] = model;
    }
  });
};

loadModels(path.join(__dirname, "user"));

// Set up associations
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
