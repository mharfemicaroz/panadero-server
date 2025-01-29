"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("warehouses", [
      {
        name: "Main Warehouse",
        location: "Manila",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Northern Depot",
        location: "Baguio",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Southern Hub",
        location: "Cebu",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mindanao Storage",
        location: "Davao",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("warehouses", null, {});
  },
};
