"use strict";
module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define(
    "Salary",
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      basic_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      daily_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      overtime_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1.25, // 1.25x regular rate for overtime
      },
      night_differential_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1.1, // 10% additional for night shift
      },
      holiday_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 2.0, // Double pay for holidays
      },
      tax_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      effective_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "salaries",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Salary.associate = function (models) {
    Salary.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
  };

  return Salary;
};
