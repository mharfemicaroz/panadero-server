"use strict";

module.exports = (sequelize, DataTypes) => {
  const StockTransfer = sequelize.define(
    "StockTransfer",
    {
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      source_warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "warehouses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      destination_warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "warehouses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transfer_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "canceled"),
        allowNull: false,
        defaultValue: "pending",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Optionally track who created or approved the transfer
      // e.g., user_id or approved_by, etc.
    },
    {
      tableName: "stock_transfers",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  StockTransfer.associate = function (models) {
    StockTransfer.belongsTo(models.Item, {
      foreignKey: "item_id",
      as: "item",
    });

    StockTransfer.belongsTo(models.Warehouse, {
      foreignKey: "source_warehouse_id",
      as: "sourceWarehouse",
    });

    StockTransfer.belongsTo(models.Warehouse, {
      foreignKey: "destination_warehouse_id",
      as: "destinationWarehouse",
    });
  };

  return StockTransfer;
};
