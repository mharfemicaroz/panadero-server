"use strict";

module.exports = (sequelize, DataTypes) => {
  const Damage = sequelize.define(
    "Damage",
    {
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
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
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      damage_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("pending", "processed"),
        allowNull: false,
        defaultValue: "pending",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "damages",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Damage.associate = function (models) {
    Damage.belongsTo(models.Item, { foreignKey: "item_id", as: "item" });
    Damage.belongsTo(models.Warehouse, {
      foreignKey: "warehouse_id",
      as: "warehouse",
    });
  };

  return Damage;
};
