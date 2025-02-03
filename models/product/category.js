"use strict";
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
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
      categoryGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "categoryGroupId",
        references: {
          model: "category_groups",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "categories",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Category.associate = function (models) {
    Category.belongsTo(models.CategoryGroup, {
      foreignKey: "categoryGroupId",
      as: "categoryGroup",
    });

    // ✅ FIX: Define hasMany association with Subcategory
    Category.hasMany(models.Subcategory, {
      foreignKey: "categoryId",
      as: "subcategories",
    });

    // ✅ FIX: Define hasMany association with Item
    Category.hasMany(models.Item, {
      foreignKey: "category_id",
      as: "products",
    });
  };

  return Category;
};
