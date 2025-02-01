"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("customers", [
      {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "09171234567",
        address: "123 Elm Street, Manila",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "09229876543",
        address: "456 Oak Avenue, Quezon City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Carlos",
        last_name: "Garcia",
        email: "carlos.garcia@example.com",
        phone: "09181112222",
        address: "789 Maple Road, Cebu City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Maria",
        last_name: "Reyes",
        email: "maria.reyes@example.com",
        phone: "09334445556",
        address: "135 Cherry St., Davao City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Rico",
        last_name: "Mendoza",
        email: "rico.mendoza@example.com",
        phone: "09443332211",
        address: "246 Pine Avenue, Makati City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("customers", null, {});
  },
};
