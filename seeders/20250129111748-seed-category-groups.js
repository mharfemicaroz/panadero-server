"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("category_groups", [
      {
        name: "Bakery",
        description: "All bakery-related products",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Pastries",
        description: "Sweet and savory pastries",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Desserts",
        description: "Sweet desserts and delicacies",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("category_groups", null, {});
  },
};
