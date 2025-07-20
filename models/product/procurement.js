// models/Procurement.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Procurement = sequelize.define(
    "Procurement",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "suppliers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "warehouses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      procurement_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("pending", "received", "canceled"),
        allowNull: false,
        defaultValue: "pending",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "procurements",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Procurement.associate = function (models) {
    Procurement.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Procurement.belongsTo(models.Supplier, {
      foreignKey: "supplier_id",
      as: "supplier",
    });
    Procurement.belongsTo(models.Warehouse, {
      foreignKey: "warehouse_id",
      as: "warehouse",
    });
    // New association: a procurement can have many items
    Procurement.hasMany(models.ProcurementItem, {
      foreignKey: "procurement_id",
      as: "items",
    });
  };

  return Procurement;
};
