const User = require("./User");

module.exports = (sequelize, DataTypes) => {
  const models = {
    User: User(sequelize, DataTypes),
  };

  return models;
};
