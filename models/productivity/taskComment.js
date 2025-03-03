"use strict";

module.exports = (sequelize, DataTypes) => {
  const TaskComment = sequelize.define(
    "TaskComment",
    {
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // The Employee who wrote the comment
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Optional: store file links or additional metadata
    },
    {
      tableName: "task_comments",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  TaskComment.associate = function (models) {
    TaskComment.belongsTo(models.Task, {
      foreignKey: "task_id",
      as: "task",
    });
    TaskComment.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
  };

  return TaskComment;
};
