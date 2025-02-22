"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobTitle = sequelize.define(
    "JobTitle",
    {
      title: {
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
      tableName: "job_titles",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  JobTitle.associate = function (models) {
    JobTitle.hasMany(models.Employee, {
      foreignKey: "job_title_id",
      as: "employees",
    });
  };

  return JobTitle;
};
