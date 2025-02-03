const Branch = require("./branch");

module.exports = (sequelize, DataTypes) => {
  const models = {
    Branch: Branch(sequelize, DataTypes),
  };

  return models;
};
