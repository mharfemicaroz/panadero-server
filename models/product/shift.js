"use strict";
module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define(
    "Shift",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true, // null if the shift is still open
      },
      status: {
        type: DataTypes.STRING, // e.g., "open", "closed"
        allowNull: false,
        defaultValue: "open",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // New fields for cash drawer management
      opening_cash_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        comment: "The cash amount in the drawer at the start of the shift",
      },
      closing_cash_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment:
          "The expected/actual cash amount in the drawer at the end of the shift",
      },
      cash_sales_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Total cash sales processed during the shift",
      },
    },
    {
      tableName: "shifts",
      underscored: true, // automatically convert camelCase to snake_case in the DB
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Shift.associate = function (models) {
    // Associate the shift with a User.
    Shift.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    // Associate the shift with a Branch.
    Shift.belongsTo(models.Branch, {
      foreignKey: "branchId",
      as: "branch",
    });
  };

  return Shift;
};
