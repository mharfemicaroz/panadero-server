"use strict";
module.exports = (sequelize, DataTypes) => {
  const TimeLog = sequelize.define(
    "TimeLog",
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
      type: {
        type: DataTypes.ENUM("time_in", "time_out"),
        allowNull: false,
      },
      log_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "time_logs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  TimeLog.associate = function (models) {
    TimeLog.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
  };

  return TimeLog;
};
