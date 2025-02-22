"use strict";
module.exports = (sequelize, DataTypes) => {
  const LeaveBalance = sequelize.define(
    "LeaveBalance",
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
      leave_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "leave_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      total_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      used_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remaining_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carry_forward_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "leave_balances",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  LeaveBalance.associate = function (models) {
    LeaveBalance.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
    LeaveBalance.belongsTo(models.LeaveType, {
      foreignKey: "leave_type_id",
      as: "leaveType",
    });
  };

  return LeaveBalance;
};
