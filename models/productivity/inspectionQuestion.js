"use strict";

module.exports = (sequelize, DataTypes) => {
  const InspectionQuestion = sequelize.define(
    "InspectionQuestion",
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
      question_text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.ENUM("likert", "multiple_choice", "open_ended"),
        defaultValue: "open_ended",
      },
      options: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "inspection_questions",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  InspectionQuestion.associate = function (models) {
    InspectionQuestion.belongsTo(models.Inspection, {
      foreignKey: "inspection_id",
      as: "inspection",
    });
  };

  return InspectionQuestion;
};
