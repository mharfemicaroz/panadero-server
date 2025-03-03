"use strict";
<<<<<<< HEAD
=======

>>>>>>> 5d599e5abe490abc467f68f0fef3998953d5e14b
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("attendances", {
      id: {
<<<<<<< HEAD
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
=======
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
>>>>>>> 5d599e5abe490abc467f68f0fef3998953d5e14b
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
<<<<<<< HEAD
          model: "employees", // Make sure this matches your employees table name
=======
          model: "employees",
>>>>>>> 5d599e5abe490abc467f68f0fef3998953d5e14b
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("present", "absent", "late", "half_day"),
        defaultValue: "present",
      },
      total_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
      },
      overtime_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
      },
      night_differential_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
      },
      is_holiday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("attendances");
  },
};
