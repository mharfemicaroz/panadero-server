"use strict";

module.exports = (sequelize, DataTypes) => {
  const CashRegister = sequelize.define(
    "CashRegister",
    {
      sale_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "sales", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      shift_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "shifts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      cash: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: "The amount tendered",
      },
      type: {
        type: DataTypes.ENUM("in", "out"),
        allowNull: false,
        comment: "Indicates if the cash transaction is incoming or outgoing",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Additional details regarding the transaction",
      },
      transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "Date and time of the cash transaction",
      },
    },
    {
      tableName: "cash_registers",
      underscored: false,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  CashRegister.associate = function (models) {
    CashRegister.belongsTo(models.Sale, { foreignKey: "sale_id", as: "sale" });
    CashRegister.belongsTo(models.Shift, {
      foreignKey: "shift_id",
      as: "shift",
    });
  };

  return CashRegister;
};
