"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the category IDs dynamically
    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories;`
    );

    const categoryMap = {};
    categories[0].forEach((category) => {
      categoryMap[category.name] = category.id;
    });

    await queryInterface.bulkInsert("subcategories", [
      {
        name: "Whole Wheat Bread",
        description: "Healthy whole wheat bread",
        is_active: true,
        category_id: categoryMap["Bread"], // Ensure category "Bread" exists
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Baguette",
        description: "Classic French baguette",
        is_active: true,
        category_id: categoryMap["Bread"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Chocolate Cake",
        description: "Delicious chocolate cake",
        is_active: true,
        category_id: categoryMap["Cakes"], // Ensure category "Cakes" exists
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Cheesecake",
        description: "Classic cheesecake with a creamy texture",
        is_active: true,
        category_id: categoryMap["Cakes"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Croissant",
        description: "Buttery and flaky French croissant",
        is_active: true,
        category_id: categoryMap["Bread"], // Ensure category "Pastries" exists
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Chocolate Chip Cookies",
        description: "Crunchy and soft chocolate chip cookies",
        is_active: true,
        category_id: categoryMap["Cookies"], // Ensure category "Cookies" exists
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Oatmeal Cookies",
        description: "Healthy oatmeal cookies",
        is_active: true,
        category_id: categoryMap["Cookies"],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Blueberry Muffin",
        description: "Soft and fluffy blueberry muffin",
        is_active: true,
        category_id: categoryMap["Muffins"], // Ensure category "Muffins" exists
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Chocolate Muffin",
        description: "Delicious chocolate muffin",
        is_active: true,
        category_id: categoryMap["Muffins"],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subcategories", null, {});
  },
};
