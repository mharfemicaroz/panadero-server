"use strict";

module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "items", // Must match the table name "items"
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "warehouses", // Must match the table name "warehouses"
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      current_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // Optional fields for more advanced tracking:
      minimum_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      maximum_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reorder_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "inventories",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Inventory.associate = function (models) {
    Inventory.belongsTo(models.Item, {
      foreignKey: "item_id",
      as: "item",
    });
    Inventory.belongsTo(models.Warehouse, {
      foreignKey: "warehouse_id",
      as: "warehouse",
    });
    Inventory.hasMany(models.StockMovement, {
      foreignKey: "inventory_id",
      as: "stock_movements",
    });
  };

  return Inventory;
};
