"use strict";

module.exports = (sequelize, DataTypes) => {
  const Inspection = sequelize.define(
    "Inspection",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "departments", // from models/hr/Department
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
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
      is_scheduled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      scheduled_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "completed"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "inspections",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Inspection.associate = function (models) {
    // Belongs to HR's Department
    Inspection.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "department",
    });
    // Belongs to an HR Employee who is the manager
    Inspection.belongsTo(models.Employee, {
      foreignKey: "manager_id",
      as: "manager",
    });
    // Link to child models
    Inspection.hasMany(models.InspectionQuestion, {
      foreignKey: "inspection_id",
      as: "questions",
    });
    Inspection.hasMany(models.InspectionResponse, {
      foreignKey: "inspection_id",
      as: "responses",
    });
    Inspection.hasMany(models.InspectionIssue, {
      foreignKey: "inspection_id",
      as: "issues",
    });
  };

  return Inspection;
};
