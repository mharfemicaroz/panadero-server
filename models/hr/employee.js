"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      job_title_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "job_titles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      is_manager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "employees",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Employee.associate = function (models) {
    Employee.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "department",
    });
    Employee.belongsTo(models.JobTitle, {
      foreignKey: "job_title_id",
      as: "jobTitle",
    });
  };

  return Employee;
};
