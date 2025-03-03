const Inspection = require("./inspection");
const Project = require("./project");
const Task = require("./task");

module.exports = (sequelize, DataTypes) => {
  const models = {
    Inspection: Inspection(sequelize, DataTypes),
    Project: Project(sequelize, DataTypes),
    Task: Task(sequelize, DataTypes),
  };

  return models;
};
