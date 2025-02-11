"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sales", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "branches",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "warehouses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      shift_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "shifts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("completed", "suspended", "voided", "re-opened"),
        allowNull: false,
        defaultValue: "suspended",
      },
      sale_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      discount_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      payment_type: {
        type: Sequelize.ENUM(
          "Cash",
          "Check",
          "Debit Card",
          "Credit Card",
          "E-Wallet",
          "Bank"
        ),
        allowNull: false,
        defaultValue: "Cash",
      },
      checkNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      walletReference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cardAuthCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankReference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("sales");
  },
};
