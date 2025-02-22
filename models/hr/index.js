const Employee = require("./department");
const Department = require("./department");
const JobTitle = require("./jobTitle");

module.exports = (sequelize, DataTypes) => {
  const models = {
    Employee: Employee(sequelize, DataTypes),
    Department: Department(sequelize, DataTypes),
    JobTitle: JobTitle(sequelize, DataTypes),
  };

  return models;
};
