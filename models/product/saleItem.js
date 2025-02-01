"use strict";

module.exports = (sequelize, DataTypes) => {
  const SaleItem = sequelize.define(
    "SaleItem",
    {
      sale_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "sales", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "sale_items",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  SaleItem.associate = function (models) {
    SaleItem.belongsTo(models.Sale, { foreignKey: "sale_id", as: "sale" });
    SaleItem.belongsTo(models.Item, { foreignKey: "item_id", as: "item" });
  };

  return SaleItem;
};
