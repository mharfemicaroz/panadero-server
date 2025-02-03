"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      type: {
        type: DataTypes.ENUM("LOW_STOCK", "ORDER_STATUS", "SYSTEM_ALERT"),
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      related_item_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "items",
          key: "id",
        },
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "warehouses",
          key: "id",
        },
      },
    },
    { tableName: "notifications", underscored: true, timestamps: true }
  );

  Notification.associate = function (models) {
    Notification.belongsTo(models.Item, {
      foreignKey: "related_item_id",
      as: "productItem",
    });
    Notification.belongsTo(models.Warehouse, {
      foreignKey: "warehouse_id",
      as: "warehouse",
    });
  };

  return Notification;
};
