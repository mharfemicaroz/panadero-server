"use strict";
module.exports = (sequelize, DataTypes) => {
  const Deduction = sequelize.define(
    "Deduction",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM(
          "tax",
          "sss",
          "philhealth",
          "pagibig",
          "loan",
          "cash_advance",
          "other"
        ),
        allowNull: false,
      },
      amount_type: {
        type: DataTypes.ENUM("fixed", "percentage"),
        allowNull: false,
        defaultValue: "fixed",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      is_recurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      frequency: {
        type: DataTypes.ENUM(
          "per_payroll",
          "monthly",
          "quarterly",
          "annual",
          "one_time"
        ),
        allowNull: false,
        defaultValue: "per_payroll",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "deductions",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Deduction.associate = function (models) {
    Deduction.hasMany(models.PayrollDeduction, {
      foreignKey: "deduction_id",
      as: "payroll_deductions",
    });
  };

  return Deduction;
};
