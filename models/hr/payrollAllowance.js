"use strict";
module.exports = (sequelize, DataTypes) => {
  const PayrollAllowance = sequelize.define(
    "PayrollAllowance",
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
      allowance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "allowances",
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
      is_taxable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "payroll_allowances",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  PayrollAllowance.associate = function (models) {
    PayrollAllowance.belongsTo(models.Payroll, {
      foreignKey: "payroll_id",
      as: "payroll",
    });
    PayrollAllowance.belongsTo(models.Allowance, {
      foreignKey: "allowance_id",
      as: "allowance",
    });
  };

  return PayrollAllowance;
};
