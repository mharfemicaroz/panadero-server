"use strict";
module.exports = (sequelize, DataTypes) => {
  const PayrollDeduction = sequelize.define(
    "PayrollDeduction",
    {
      payroll_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "payrolls",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      deduction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "deductions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "payroll_deductions",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  PayrollDeduction.associate = function (models) {
    PayrollDeduction.belongsTo(models.Payroll, {
      foreignKey: "payroll_id",
      as: "payroll",
    });
    PayrollDeduction.belongsTo(models.Deduction, {
      foreignKey: "deduction_id",
      as: "deduction",
    });
  };

  return PayrollDeduction;
};
