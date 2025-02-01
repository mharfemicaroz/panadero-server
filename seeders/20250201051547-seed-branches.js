"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("branches", [
      {
        name: "Main Branch",
        location: "Manila",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Northern Branch",
        location: "Baguio",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Southern Branch",
        location: "Cebu",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mindanao Branch",
        location: "Davao",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Western Branch",
        location: "Iloilo",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("branches", null, {});
  },
};
