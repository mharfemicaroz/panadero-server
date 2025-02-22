"use strict";
module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define(
    "Payroll",
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      payroll_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      basic_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_days_worked: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_hours_worked: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      overtime_hours: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      night_differential_hours: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      holiday_hours: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      gross_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      overtime_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      night_differential_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      holiday_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      allowances: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      deductions: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax_deduction: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      net_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("draft", "approved", "paid"),
        defaultValue: "draft",
      },
      payment_method: {
        type: DataTypes.ENUM("bank_transfer", "cash", "check"),
        allowNull: false,
        defaultValue: "bank_transfer",
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
      tableName: "payrolls",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Payroll.associate = function (models) {
    Payroll.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
    Payroll.hasMany(models.PayrollDeduction, {
      foreignKey: "payroll_id",
      as: "payroll_deductions",
    });
    Payroll.hasMany(models.PayrollAllowance, {
      foreignKey: "payroll_id",
      as: "payroll_allowances",
    });
  };

  return Payroll;
};
