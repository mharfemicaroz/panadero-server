const { Sequelize } = require("sequelize");
const config = require("../config/config.json");
require("dotenv").config();

const env = process.env.NODE_ENV;
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
    // Use the offset for Philippine time
    timezone: "+08:00",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
})();

module.exports = sequelize;
