"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("departments", [
      {
        name: "Human Resources",
        description: "Handles employee relations and benefits.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Finance",
        description: "Manages financial operations and budgeting.",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("departments", null, {});
  },
};
