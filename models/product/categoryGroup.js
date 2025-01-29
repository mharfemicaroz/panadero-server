"use strict";
module.exports = (sequelize, DataTypes) => {
  const CategoryGroup = sequelize.define(
    "CategoryGroup",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "category_groups",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  CategoryGroup.associate = function (models) {
    CategoryGroup.hasMany(models.Category, {
      foreignKey: "categoryGroupId",
      as: "categories",
    });
  };

  return CategoryGroup;
};
