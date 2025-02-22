"use strict";
module.exports = (sequelize, DataTypes) => {
  const LeaveType = sequelize.define(
    "LeaveType",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      max_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carry_forward_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "leave_types",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  LeaveType.associate = function (models) {
    LeaveType.hasMany(models.LeaveRequest, {
      foreignKey: "leave_type_id",
      as: "leaveRequests",
    });
    LeaveType.hasMany(models.LeaveBalance, {
      foreignKey: "leave_type_id",
      as: "leaveBalances",
    });
  };

  return LeaveType;
};
