"use strict";

module.exports = (sequelize, DataTypes) => {
  const InspectionIssue = sequelize.define(
    "InspectionIssue",
    {
      inspection_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "inspections",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "low",
      },
      status: {
        type: DataTypes.ENUM("open", "in_progress", "resolved"),
        defaultValue: "open",
      },
      resolution_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "inspection_issues",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  InspectionIssue.associate = function (models) {
    InspectionIssue.belongsTo(models.Inspection, {
      foreignKey: "inspection_id",
      as: "inspection",
    });
  };

  return InspectionIssue;
};
