const { Op } = require("sequelize");
const db = global.requireV2("models");
const StockTransfer = db.StockTransfer;
const Item = db.Item;
const Warehouse = db.Warehouse;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class StockTransferRepository extends AbstractRepository {
  constructor() {
    super(StockTransfer);
  }

  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;

    const where = {};

    // Filters
    if (filters.item_id) {
      where.item_id = filters.item_id;
    }
    if (filters.status) {
      where.status = filters.status; // exact match or consider an IN array
    }
    if (filters.source_warehouse_id) {
      where.source_warehouse_id = filters.source_warehouse_id;
    }
    if (filters.destination_warehouse_id) {
      where.destination_warehouse_id = filters.destination_warehouse_id;
    }
    if (filters.start_date && filters.end_date) {
      // Filter by transfer_date range
      where.transfer_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }

    const result = await StockTransfer.findAndCountAll({
      where,
      include: [
        {
          model: Item,
          as: "item",
        },
        {
          model: Warehouse,
          as: "sourceWarehouse",
        },
        {
          model: Warehouse,
          as: "destinationWarehouse",
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });

    return result;
  }

  async create(data) {
    return StockTransfer.create(data);
  }

  async getById(id) {
    return StockTransfer.findByPk(id, {
      include: [
        { model: Item, as: "item" },
        { model: Warehouse, as: "sourceWarehouse" },
        { model: Warehouse, as: "destinationWarehouse" },
      ],
    });
  }

  async update(id, data) {
    const record = await StockTransfer.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await StockTransfer.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new StockTransferRepository();
