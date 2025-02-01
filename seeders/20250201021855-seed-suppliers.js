"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("suppliers", [
      {
        name: "ABC Baking Supplies",
        contact_person: "Juan Dela Cruz",
        phone: "09171234567",
        email: "abc_baking@gmail.com",
        address: "123 Main Street, Manila",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Golden Flour Distributors",
        contact_person: "Maria Santos",
        phone: "09229876543",
        email: "goldenflour@supply.com",
        address: "456 Market Road, Quezon City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Fresh Dairy Supplies",
        contact_person: "Jose Gomez",
        phone: "09181112222",
        email: "freshdairy@wholesale.com",
        address: "789 Dairy Lane, Cebu City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sweet Delights Ingredients",
        contact_person: "Ana Reyes",
        phone: "09334445556",
        email: "sweetdelights@supplier.com",
        address: "135 Sugar St., Davao City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Premium Packaging Solutions",
        contact_person: "Rico Mendoza",
        phone: "09443332211",
        email: "premiumpack@packaging.com",
        address: "246 Box Avenue, Makati City",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("suppliers", null, {});
  },
};
