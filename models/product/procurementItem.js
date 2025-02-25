// models/ProcurementItem.js
module.exports = (sequelize, DataTypes) => {
  const ProcurementItem = sequelize.define(
    "ProcurementItem",
    {
      procurement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "procurements",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "item_id", // Explicitly set the database column name
        references: {
          model: "items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "procurement_items",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  ProcurementItem.associate = function (models) {
    ProcurementItem.belongsTo(models.Procurement, {
      foreignKey: "procurement_id",
      as: "procurement",
    });
    ProcurementItem.belongsTo(models.Item, {
      foreignKey: "item_id",
      as: "item",
    });
  };

  return ProcurementItem;
};
