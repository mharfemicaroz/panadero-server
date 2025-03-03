"use strict";

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Reference to an Employee who manages this project
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees", // from models/hr/Employee
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // e.g. 'not_started', 'active', 'on_hold', 'completed'
      status: {
        type: DataTypes.ENUM("not_started", "active", "on_hold", "completed"),
        defaultValue: "not_started",
      },
    },
    {
      tableName: "projects",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Project.associate = function (models) {
    // Manager reference
    Project.belongsTo(models.Employee, {
      foreignKey: "manager_id",
      as: "manager",
    });

    // One-to-many relationship with tasks
    Project.hasMany(models.Task, {
      foreignKey: "project_id",
      as: "tasks",
    });
  };

  return Project;
};
