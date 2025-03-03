"use strict";

module.exports = (sequelize, DataTypes) => {
  const InspectionResponse = sequelize.define(
    "InspectionResponse",
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
      inspection_question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "inspection_questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "inspection_responses",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  InspectionResponse.associate = function (models) {
    InspectionResponse.belongsTo(models.Inspection, {
      foreignKey: "inspection_id",
      as: "inspection",
    });
    InspectionResponse.belongsTo(models.InspectionQuestion, {
      foreignKey: "inspection_question_id",
      as: "question",
    });
  };

  return InspectionResponse;
};
