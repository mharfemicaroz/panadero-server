"use strict";

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "projects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Reference to an Employee assigned to this task
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees", // from models/hr/Employee
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // e.g. 'to_do', 'in_progress', 'completed'
      status: {
        type: DataTypes.ENUM("to_do", "in_progress", "completed"),
        defaultValue: "to_do",
      },
      // e.g. 'low', 'medium', 'high'
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "medium",
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "tasks",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Task.associate = function (models) {
    // Project relationship
    Task.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project",
    });

    // Assigned Employee
    Task.belongsTo(models.Employee, {
      foreignKey: "assigned_to",
      as: "assignee",
    });

    // Comments
    Task.hasMany(models.TaskComment, {
      foreignKey: "task_id",
      as: "comments",
    });
  };

  return Task;
};
