const db = global.requireV2("models");

class ReportsController {
  async stockMovements(req, res) {
    try {
      // Query StockTransfer using the defined alias "item" (not "productItem")
      const stockTransfers = await db.StockTransfer.findAll({
        include: [
          { model: db.Item, as: "item" },
          { model: db.Warehouse, as: "sourceWarehouse" },
          { model: db.Warehouse, as: "destinationWarehouse" },
        ],
      });
      res.status(200).json(stockTransfers);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching stock movements",
        error: error.message,
      });
    }
  }

  async warehouseUtilization(req, res) {
    try {
      // Query Inventory and include Warehouse with the alias "warehouse"
      const inventories = await db.Inventory.findAll({
        include: [{ model: db.Warehouse, as: "warehouse" }],
      });
      // Optionally, you could aggregate these results (e.g., group by warehouse and sum current_quantity)
      res.status(200).json(inventories);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching warehouse utilization",
        error: error.message,
      });
    }
  }

  async inventorySummary(req, res) {
    try {
      // Query Inventory and include Item using the correct alias "item" (not "productItem")
      const inventories = await db.Inventory.findAll({
        include: [{ model: db.Item, as: "item" }],
      });
      res.status(200).json(inventories);
    } catch (error) {
      res.status(500).json({
        message: "Error generating inventory summary",
        error: error.message,
      });
    }
  }
}

module.exports = new ReportsController();
