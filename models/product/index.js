const Category = require("./category");
const CategoryGroup = require("./categoryGroup");
const Subcategory = require("./subcategory");
const Item = require("./item");

module.exports = (sequelize, DataTypes) => {
  const models = {
    Category: Category(sequelize, DataTypes),
    CategoryGroup: CategoryGroup(sequelize, DataTypes),
    Subcategory: Subcategory(sequelize, DataTypes),
    Item: Item(sequelize, DataTypes),
  };

  return models;
};
