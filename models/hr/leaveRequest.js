"use strict";
module.exports = (sequelize, DataTypes) => {
  const LeaveRequest = sequelize.define(
    "LeaveRequest",
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
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      approver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      emergency_contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "leave_requests",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  LeaveRequest.associate = function (models) {
    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
    LeaveRequest.belongsTo(models.LeaveType, {
      foreignKey: "leave_type_id",
      as: "leaveType",
    });
    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: "approver_id",
      as: "approver",
    });
    LeaveRequest.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "department",
    });
  };

  return LeaveRequest;
};
