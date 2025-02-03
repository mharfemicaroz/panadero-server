const db = require("@models");
const Inventory = db.Inventory;
const Warehouse = db.Warehouse;
const Item = db.Item;
const StockTransfer = db.StockTransfer;
const { Op } = require("sequelize");

class ReportService {
  async getInventorySummary() {
    return await Inventory.findAll({
      attributes: [
        "product_item_id",
        [db.Sequelize.fn("SUM", db.Sequelize.col("quantity")), "total_stock"],
      ],
      include: [
        { model: Item, as: "productItem", attributes: ["name", "sku"] },
      ],
      group: ["product_item_id"],
    });
  }

  async getWarehouseUtilization() {
    return await Warehouse.findAll({
      attributes: ["id", "name", "capacity"],
      include: [
        {
          model: Inventory,
          as: "inventory",
          attributes: [
            [
              db.Sequelize.fn("SUM", db.Sequelize.col("quantity")),
              "total_stock",
            ],
          ],
        },
      ],
      group: ["Warehouse.id"],
    });
  }

  async getStockMovements({ startDate, endDate }) {
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    return await StockTransfer.findAll({
      where: whereClause,
      include: [
        { model: Item, as: "productItem", attributes: ["name", "sku"] },
        { model: Warehouse, as: "sourceWarehouse", attributes: ["name"] },
        { model: Warehouse, as: "destinationWarehouse", attributes: ["name"] },
      ],
      order: [["created_at", "DESC"]],
    });
  }
}

module.exports = new ReportService();
