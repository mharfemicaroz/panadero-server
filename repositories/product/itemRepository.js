const { Op } = require("sequelize");
const db = require("../../models");
const Item = db.Item;
const Warehouse = db.Warehouse;
const Category = db.Category;
const Subcategory = db.Subcategory;
const AbstractRepository = require("../../base/AbstractRepository");

class ItemRepository extends AbstractRepository {
  constructor() {
    super(Item);
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
    if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };
    if (filters.sku) where.sku = filters.sku;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.category_id) where.category_id = filters.category_id;
    if (filters.subcategory_id) where.subcategory_id = filters.subcategory_id;
    if (filters.sold_by) where.sold_by = filters.sold_by;

    return Item.findAndCountAll({
      where,
      include: [
        { model: Warehouse, as: "warehouse" },
        { model: Category, as: "category" },
        {
          model: Subcategory,
          as: "subcategory",
          required: false, // Only join if subcategory_id is not null
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }
}

module.exports = new ItemRepository();
