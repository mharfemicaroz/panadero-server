"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cash_registers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sale_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Optional: not every cash transaction is linked to a sale
        references: {
          model: "sales",
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
      cash: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: "The amount tendered",
      },
      type: {
        type: Sequelize.ENUM("in", "out"),
        allowNull: false,
        comment: "Indicates if the cash transaction is incoming or outgoing",
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Additional details regarding the transaction",
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
        comment: "Date and time of the cash transaction",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cash_registers");
    // For PostgreSQL, also drop the enum type created for 'type'
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_cash_registers_type";'
    );
  },
};
