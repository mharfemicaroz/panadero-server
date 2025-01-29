"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch category, subcategory, and warehouse IDs dynamically
    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories;`
    );
    const subcategories = await queryInterface.sequelize.query(
      `SELECT id, name FROM subcategories;`
    );
    const warehouses = await queryInterface.sequelize.query(
      `SELECT id, name FROM warehouses;`
    );

    const categoryMap = {};
    categories[0].forEach((category) => {
      categoryMap[category.name] = category.id;
    });

    const subcategoryMap = {};
    subcategories[0].forEach((subcategory) => {
      subcategoryMap[subcategory.name] = subcategory.id;
    });

    const warehouseMap = {};
    warehouses[0].forEach((warehouse) => {
      warehouseMap[warehouse.name] = warehouse.id;
    });

    await queryInterface.bulkInsert("items", [
      {
        name: "Pandesal",
        price: 5.0,
        beginning_qty: 500,
        sku: "PAN-001",
        barcode: "1234567890",
        cost: 3.0,
        unit_of_measurement: "pcs",
        sold_by: "each",
        warehouse_id: warehouseMap["Main Warehouse"],
        category_id: categoryMap["Bread"],
        subcategory_id: subcategoryMap["Whole Wheat Bread"] || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Ensaymada",
        price: 25.0,
        beginning_qty: 200,
        sku: "ENS-002",
        barcode: "1234567891",
        cost: 15.0,
        unit_of_measurement: "pcs",
        sold_by: "each",
        warehouse_id: warehouseMap["Main Warehouse"],
        category_id: categoryMap["Filipino Delicacies"],
        subcategory_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Spanish Bread",
        price: 12.0,
        beginning_qty: 250,
        sku: "SPB-003",
        barcode: "1234567892",
        cost: 7.0,
        unit_of_measurement: "pcs",
        sold_by: "each",
        warehouse_id: warehouseMap["Northern Depot"],
        category_id: categoryMap["Bread"],
        subcategory_id: subcategoryMap["Baguette"] || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Leche Flan",
        price: 90.0,
        beginning_qty: 75,
        sku: "LEC-004",
        barcode: "1234567893",
        cost: 60.0,
        unit_of_measurement: "tray",
        sold_by: "each",
        warehouse_id: warehouseMap["Southern Hub"],
        category_id: categoryMap["Filipino Delicacies"],
        subcategory_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Bibingka",
        price: 50.0,
        beginning_qty: 100,
        sku: "BIB-005",
        barcode: "1234567894",
        cost: 30.0,
        unit_of_measurement: "pcs",
        sold_by: "each",
        warehouse_id: warehouseMap["Main Warehouse"],
        category_id: categoryMap["Filipino Delicacies"],
        subcategory_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Puto",
        price: 20.0,
        beginning_qty: 150,
        sku: "PUT-006",
        barcode: "1234567895",
        cost: 10.0,
        unit_of_measurement: "pack",
        sold_by: "each",
        warehouse_id: warehouseMap["Northern Depot"],
        category_id: categoryMap["Filipino Delicacies"],
        subcategory_id: subcategoryMap["Oatmeal Cookies"] || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Cassava Cake",
        price: 80.0,
        beginning_qty: 50,
        sku: "CAS-007",
        barcode: "1234567896",
        cost: 50.0,
        unit_of_measurement: "tray",
        sold_by: "each",
        warehouse_id: warehouseMap["Southern Hub"],
        category_id: categoryMap["Filipino Delicacies"],
        subcategory_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Ube Cheese Pandesal",
        price: 15.0,
        beginning_qty: 300,
        sku: "UCP-008",
        barcode: "1234567897",
        cost: 8.0,
        unit_of_measurement: "pcs",
        sold_by: "each",
        warehouse_id: warehouseMap["Main Warehouse"],
        category_id: categoryMap["Bread"],
        subcategory_id: subcategoryMap["Baguette"] || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Egg Pie",
        price: 120.0,
        beginning_qty: 50,
        sku: "EGP-009",
        barcode: "1234567898",
        cost: 70.0,
        unit_of_measurement: "pcs",
        sold_by: "each",
        warehouse_id: warehouseMap["Mindanao Storage"],
        category_id: categoryMap["Pies"],
        subcategory_id: subcategoryMap["Tarts"] || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Chocolate Cake",
        price: 180.0,
        beginning_qty: 60,
        sku: "CHC-010",
        barcode: "1234567899",
        cost: 110.0,
        unit_of_measurement: "pcs",
        sold_by: "each",
        warehouse_id: warehouseMap["Southern Hub"],
        category_id: categoryMap["Cakes"],
        subcategory_id: subcategoryMap["Chocolate Cake"] || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("items", null, {});
  },
};
