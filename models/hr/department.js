"use strict";
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "departments",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Department.associate = function (models) {
    Department.hasMany(models.Employee, {
      foreignKey: "department_id",
      as: "employees",
    });
  };

  return Department;
};
