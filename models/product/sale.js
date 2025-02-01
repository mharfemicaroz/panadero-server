"use strict";

module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    "Sale",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "branches", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "warehouses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "customers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("completed", "suspended", "voided", "re-opened"),
        allowNull: false,
        defaultValue: "suspended",
      },
      sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      discount_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "sales",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Sale.associate = function (models) {
    Sale.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Sale.belongsTo(models.Branch, { foreignKey: "branch_id", as: "branch" });
    Sale.belongsTo(models.Warehouse, {
      foreignKey: "warehouse_id",
      as: "warehouse",
    });
    Sale.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });
    Sale.hasMany(models.SaleItem, { foreignKey: "sale_id", as: "saleItems" });
  };

  return Sale;
};
