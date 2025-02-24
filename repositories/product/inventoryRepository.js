const { Op } = require("sequelize");
const db = global.requireV2("models");
const Inventory = db.Inventory;
const Item = db.Item;
const Category = db.Category;
const Subcategory = db.Subcategory;
const Warehouse = db.Warehouse;
const StockMovement = db.StockMovement;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class InventoryRepository extends AbstractRepository {
  constructor() {
    super(Inventory);
  }

  /**
   * Listing/pagination with optional filters.
   */
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;

    const where = {};

    // Inventory-specific filters
    if (filters.item_id) where.item_id = filters.item_id;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;

    // Build date filter for stock_movements (instead of applying it to the inventory record)
    const stockMovementDateFilter = {};
    if (filters.start_date && filters.end_date) {
      stockMovementDateFilter.created_at = {
        [db.Sequelize.Op.between]: [filters.start_date, filters.end_date],
      };
    } else if (filters.start_date) {
      stockMovementDateFilter.created_at = {
        [db.Sequelize.Op.gte]: filters.start_date,
      };
    } else if (filters.end_date) {
      stockMovementDateFilter.created_at = {
        [db.Sequelize.Op.lte]: filters.end_date,
      };
    }

    return Inventory.findAndCountAll({
      distinct: true,
      where,
      attributes: [
        "id",
        "current_quantity",
        "minimum_quantity",
        "maximum_quantity",
        "reorder_level",
        "created_at",
      ],
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["id", "name", "price", "cost", "beginning_qty"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name"],
            },
            {
              model: Subcategory,
              as: "subcategory",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Warehouse,
          as: "warehouse",
          attributes: ["id", "name"],
        },
        {
          model: StockMovement,
          as: "stock_movements",
          attributes: [
            "id",
            "type",
            "note",
            "quantity_change",
            "new_quantity",
            "warehouse_id",
            "created_at",
          ],
          // Only apply the date filter if one of the start_date/end_date was provided
          where: Object.keys(stockMovementDateFilter).length
            ? stockMovementDateFilter
            : undefined,
          // Use a left join so that inventory records are still returned if they have no matching stock movements
          required: false,
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return Inventory.create(data);
  }

  async getById(id) {
    // We can do a single PK find or a composite find if needed.
    return Inventory.findByPk(id, {
      attributes: [
        "id",
        "current_quantity",
        "minimum_quantity",
        "maximum_quantity",
        "reorder_level",
        "warehouse_id",
      ],
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["id", "name", "price", "cost"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name"],
            },
            {
              model: Subcategory,
              as: "subcategory",
              attributes: ["id", "name"],
            },
          ],
        },
        { model: Warehouse, as: "warehouse", attributes: ["id", "name"] },
      ],
    });
  }
  async update(id, data) {
    const record = await Inventory.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await Inventory.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }

  /**
   * If you want a convenient method to update stock by a certain quantity:
   * quantityChange can be positive (IN) or negative (OUT).
   */
  async updateQuantity(inventoryId, quantityChange) {
    const record = await Inventory.findByPk(inventoryId);
    if (!record) return null;

    record.current_quantity += quantityChange;
    return record.save();
  }

  /**
   * Find Inventory by item_id + warehouse_id
   * for direct increments/decrements without
   * referencing the primary key explicitly.
   */
  async findByItemAndWarehouse(item_id, warehouse_id) {
    return Inventory.findOne({
      where: { item_id, warehouse_id },
    });
  }
}

module.exports = new InventoryRepository();
