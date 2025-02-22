"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Deductions table
    await queryInterface.createTable("deductions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM("fixed", "percentage"),
        allowNull: false,
        defaultValue: "fixed",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      is_recurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      frequency: {
        type: Sequelize.ENUM(
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

    // Create Allowances table
    await queryInterface.createTable("allowances", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM("fixed", "percentage"),
        allowNull: false,
        defaultValue: "fixed",
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
      is_recurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      frequency: {
        type: Sequelize.ENUM(
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
    await queryInterface.dropTable("allowances");
    await queryInterface.dropTable("deductions");
  },
};
