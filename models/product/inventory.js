"use strict";

module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      // Example: If you're tracking multiple warehouses
      // and individual stock per warehouse, you'll want
      // item_id + warehouse_id as a unique composite.

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
      // We can also store cost, average_cost, etc. if needed:
      // average_cost: {
      //   type: DataTypes.DECIMAL(10,2),
      //   allowNull: true,
      // },
    },
    {
      tableName: "inventories",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      // indexes: [
      //   {
      //     unique: true,
      //     fields: ["item_id", "warehouse_id"], // prevent duplicate inventory lines
      //   },
      // ],
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
  };

  return Inventory;
};
