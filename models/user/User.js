"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      date_joined: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      last_login: DataTypes.DATE,
      is_superuser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_staff: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      defaultScope: {
        attributes: [
          "id",
          "username",
          "role",
          "email",
          "first_name",
          "last_name",
        ],
      },
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
