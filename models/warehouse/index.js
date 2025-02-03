const Warehouse = require("./warehouse");

module.exports = (sequelize, DataTypes) => {
  const models = {
    Warehouse: Warehouse(sequelize, DataTypes),
  };

  return models;
};
