const Customer = require("./customer");

module.exports = (sequelize, DataTypes) => {
  const models = {
    Customer: Customer(sequelize, DataTypes),
  };

  return models;
};
