"use strict";

module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define(
    "Subcategory",
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "category_id",
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "subcategories",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Subcategory.associate = function (models) {
    Subcategory.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    // ✅ FIX: Define hasMany association with Item
    Subcategory.hasMany(models.Item, {
      foreignKey: "subcategory_id",
      as: "products",
    });
  };

  return Subcategory;
};
