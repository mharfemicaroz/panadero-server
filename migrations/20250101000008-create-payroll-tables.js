"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Payrolls table
    await queryInterface.createTable("payrolls", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      payroll_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      basic_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_days_worked: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_hours_worked: {
        type: Sequelize.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      overtime_hours: {
        type: Sequelize.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      night_differential_hours: {
        type: Sequelize.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      holiday_hours: {
        type: Sequelize.DECIMAL(7, 2),
        allowNull: false,
        defaultValue: 0,
      },
      gross_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      overtime_pay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      night_differential_pay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      holiday_pay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      allowances: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      deductions: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax_deduction: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      net_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM("draft", "approved", "paid"),
        defaultValue: "draft",
      },
      payment_method: {
        type: Sequelize.ENUM("bank_transfer", "cash", "check"),
        allowNull: false,
        defaultValue: "bank_transfer",
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    // Create PayrollDeductions junction table
    await queryInterface.createTable("payroll_deductions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      payroll_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "payrolls",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      deduction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "deductions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    // Create PayrollAllowances junction table
    await queryInterface.createTable("payroll_allowances", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      payroll_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "payrolls",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      allowance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "allowances",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      is_taxable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("payroll_allowances");
    await queryInterface.dropTable("payroll_deductions");
    await queryInterface.dropTable("payrolls");
  },
};
