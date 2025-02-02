"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];

    // First user: admin with a predefined encrypted password
    users.push({
      username: "admin",
      password: "$2b$10$xgAGwhb82hSGXyBUSYcF0eRtcoLk9h/rrq0dda7gCXT.0wjH3GbsO", // Assuming this is already encrypted
      role: "admin",
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "User",
      is_active: true,
      date_joined: new Date(),
      last_login: new Date(),
      is_superuser: true,
      is_staff: true,
      created_at: new Date(),
      updated_at: new Date(),
      refreshToken: null,
      twoFAEnabled: false,
      twoFASecret: null,
    });

    // Generate 99 random users
    for (let i = 0; i < 99; i++) {
      users.push({
        username: faker.internet.username(),
        password: faker.internet.password(), // You might hash this if needed
        role: faker.helpers.arrayElement(["admin", "user", "editor"]),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        is_active: true,
        date_joined: new Date(),
        last_login: null,
        is_superuser: false,
        is_staff: false,
        created_at: new Date(),
        updated_at: new Date(),
        refreshToken: null,
        twoFAEnabled: false,
        twoFASecret: null,
      });
    }

    await queryInterface.bulkInsert("users", users);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
