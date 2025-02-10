const { Op } = require("sequelize");
const db = global.requireV2("models");
const Item = db.Item;
const Warehouse = db.Warehouse;
const Category = db.Category;
const Subcategory = db.Subcategory;
const Inventory = db.Inventory;
const StockMovement = db.StockMovement;

class ItemRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };
    if (filters.sku) where.sku = filters.sku;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.category_id) where.category_id = filters.category_id;
    if (filters.subcategory_id) where.subcategory_id = filters.subcategory_id;
    if (filters.sold_by) where.sold_by = filters.sold_by;

    const result = await Item.findAndCountAll({
      distinct: true,
      where,
      include: [
        { model: Warehouse, as: "warehouse" },
        { model: Category, as: "category" },
        {
          model: Subcategory,
          as: "subcategory",
          required: false,
        },
        {
          model: Inventory,
          as: "inventories",
          attributes: [
            "current_quantity",
            "minimum_quantity",
            "maximum_quantity",
            "reorder_level",
          ],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
    return result;
  }

  /**
   * New method: listingWithHistory
   * Includes the inventories and their stock movements so that the Item model's
   * virtual `history` field will be populated.
   */
  async listingWithHistory({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };
    if (filters.sku) where.sku = filters.sku;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.category_id) where.category_id = filters.category_id;
    if (filters.subcategory_id) where.subcategory_id = filters.subcategory_id;
    if (filters.sold_by) where.sold_by = filters.sold_by;

    const result = await Item.findAndCountAll({
      distinct: true,
      where,
      include: [
        { model: Warehouse, as: "warehouse" },
        { model: Category, as: "category" },
        {
          model: Subcategory,
          as: "subcategory",
          required: false,
        },
        {
          model: Inventory,
          as: "inventories",
          include: [
            {
              model: StockMovement,
              as: "stock_movements",
            },
          ],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
    return result;
  }

  /**
   * Create a new item.
   */
  async create(data) {
    return await Item.create(data);
  }

  /**
   * Get an item by its primary key.
   */
  async getById(id) {
    return await Item.findByPk(id, {
      include: [
        { model: Warehouse, as: "warehouse" },
        { model: Category, as: "category" },
        {
          model: Subcategory,
          as: "subcategory",
          required: false,
        },
      ],
    });
  }

  /**
   * Update an existing item.
   */
  async update(id, data) {
    const item = await this.getById(id);
    if (!item) return null;
    return await item.update(data);
  }

  /**
   * Delete an item.
   */
  async delete(id) {
    const item = await this.getById(id);
    if (!item) return null;
    return await item.destroy();
  }
}

module.exports = new ItemRepository();
