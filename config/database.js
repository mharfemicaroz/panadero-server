const { Sequelize } = require("sequelize");
const config = require("../config/config.json");
require("dotenv").config();

const env = process.env.NODE_ENV || "development";
// Get environment
const dbConfig = config[env];
// Get Config Credential
const sequelize = new Sequelize(
  // Database name
  dbConfig.database,
  // Username
  dbConfig.username,
  //  Password
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
})();

module.exports = sequelize;
