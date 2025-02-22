"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("job_titles", [
      {
        title: "Software Engineer",
        description: "Responsible for developing software applications.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Project Manager",
        description: "Oversees project development and team management.",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("job_titles", null, {});
  },
};
