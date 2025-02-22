"use strict";
module.exports = (sequelize, DataTypes) => {
  const Allowance = sequelize.define(
    "Allowance",
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
          "transportation",
          "meal",
          "housing",
          "communication",
          "medical",
          "representation",
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
      is_taxable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_recurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      eligibility_criteria: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "allowances",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Allowance.associate = function (models) {
    Allowance.hasMany(models.PayrollAllowance, {
      foreignKey: "allowance_id",
      as: "payroll_allowances",
    });
  };

  return Allowance;
};
