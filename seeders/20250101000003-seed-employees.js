"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("employees", [
      {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        department_id: 1, // Assuming department with ID 1 exists
        job_title_id: 1, // Assuming job title with ID 1 exists
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "098-765-4321",
        department_id: 2, // Assuming department with ID 2 exists
        job_title_id: 2, // Assuming job title with ID 2 exists
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("employees", null, {});
  },
};
