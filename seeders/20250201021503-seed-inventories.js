"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch items and warehouses dynamically
    const items = await queryInterface.sequelize.query(
      `SELECT id, name FROM items;`
    );
    const warehouses = await queryInterface.sequelize.query(
      `SELECT id, name FROM warehouses;`
    );

    const itemMap = {};
    items[0].forEach((item) => {
      itemMap[item.name] = item.id;
    });

    const warehouseMap = {};
    warehouses[0].forEach((warehouse) => {
      warehouseMap[warehouse.name] = warehouse.id;
    });

    await queryInterface.bulkInsert("inventories", [
      {
        item_id: itemMap["Pandesal"],
        warehouse_id: warehouseMap["Main Warehouse"],
        current_quantity: 500,
        minimum_quantity: 50,
        maximum_quantity: 1000,
        reorder_level: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Ensaymada"],
        warehouse_id: warehouseMap["Main Warehouse"],
        current_quantity: 200,
        minimum_quantity: 20,
        maximum_quantity: 500,
        reorder_level: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Spanish Bread"],
        warehouse_id: warehouseMap["Northern Depot"],
        current_quantity: 250,
        minimum_quantity: 25,
        maximum_quantity: 600,
        reorder_level: 75,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Leche Flan"],
        warehouse_id: warehouseMap["Southern Hub"],
        current_quantity: 75,
        minimum_quantity: 10,
        maximum_quantity: 200,
        reorder_level: 25,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Bibingka"],
        warehouse_id: warehouseMap["Main Warehouse"],
        current_quantity: 100,
        minimum_quantity: 15,
        maximum_quantity: 300,
        reorder_level: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Puto"],
        warehouse_id: warehouseMap["Northern Depot"],
        current_quantity: 150,
        minimum_quantity: 20,
        maximum_quantity: 400,
        reorder_level: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Cassava Cake"],
        warehouse_id: warehouseMap["Southern Hub"],
        current_quantity: 50,
        minimum_quantity: 10,
        maximum_quantity: 150,
        reorder_level: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Ube Cheese Pandesal"],
        warehouse_id: warehouseMap["Main Warehouse"],
        current_quantity: 300,
        minimum_quantity: 30,
        maximum_quantity: 800,
        reorder_level: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Egg Pie"],
        warehouse_id: warehouseMap["Mindanao Storage"],
        current_quantity: 50,
        minimum_quantity: 10,
        maximum_quantity: 200,
        reorder_level: 25,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemMap["Chocolate Cake"],
        warehouse_id: warehouseMap["Southern Hub"],
        current_quantity: 60,
        minimum_quantity: 10,
        maximum_quantity: 150,
        reorder_level: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("inventories", null, {});
  },
};
