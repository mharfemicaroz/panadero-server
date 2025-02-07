"use strict";

module.exports = (sequelize, DataTypes) => {
  const StockMovement = sequelize.define(
    "StockMovement",
    {
      // Reference to the inventory record that was adjusted.
      inventory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "inventories", // Must match the table name for the Inventory model.
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // The type of movement: "IN" for an increase in stock, "OUT" for a decrease.
      type: {
        type: DataTypes.ENUM("IN", "OUT"),
        allowNull: false,
      },
      // The absolute value of the quantity change.
      quantity_change: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // The new quantity after the adjustment.
      new_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // The warehouse where the inventory is located.
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "warehouses", // Must match the table name for the Warehouse model.
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // (Optional) The user who performed the adjustment.
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users", // Must match the table name for the User model.
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      // Optional note for additional details about the movement.
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "stock_movements",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Define model associations.
  StockMovement.associate = function (models) {
    StockMovement.belongsTo(models.Inventory, {
      foreignKey: "inventory_id",
      as: "inventory",
    });
    StockMovement.belongsTo(models.Warehouse, {
      foreignKey: "warehouse_id",
      as: "warehouse",
    });
    StockMovement.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return StockMovement;
};
