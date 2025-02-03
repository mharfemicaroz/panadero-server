"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const categoryGroups = await queryInterface.sequelize.query(
      `SELECT id, name FROM category_groups;`
    );

    const categoryGroupMap = {};
    categoryGroups[0].forEach((group) => {
      categoryGroupMap[group.name] = group.id;
    });

    await queryInterface.bulkInsert("categories", [
      {
        name: "Bread",
        categoryGroupId: categoryGroupMap["Bakery"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Cakes",
        categoryGroupId: categoryGroupMap["Pastries"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Cookies",
        categoryGroupId: categoryGroupMap["Pastries"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Pies",
        categoryGroupId: categoryGroupMap["Pastries"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Muffins",
        categoryGroupId: categoryGroupMap["Pastries"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Filipino Delicacies",
        categoryGroupId: categoryGroupMap["Desserts"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Frozen Pastries",
        categoryGroupId: categoryGroupMap["Desserts"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Baked Desserts",
        categoryGroupId: categoryGroupMap["Desserts"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Tarts",
        categoryGroupId: categoryGroupMap["Pastries"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Savory Breads",
        categoryGroupId: categoryGroupMap["Bakery"],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
