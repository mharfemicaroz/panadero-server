const { Op } = require("sequelize");
const db = global.requireV2("models");
const Category = db.Category;
const Subcategory = db.Subcategory;
const Item = db.Item;
const Warehouse = db.Warehouse;
const Inventory = db.Inventory;

class CategoryRepository {
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
    if (filters.categoryGroupId)
      where.categoryGroupId = filters.categoryGroupId;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;
    return Category.findAndCountAll({
      where,
      include: { model: db.CategoryGroup, as: "categoryGroup" },
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async getAllWithProducts(warehouseId) {
    const categories = await Category.findAll({
      include: [
        {
          model: Subcategory,
          as: "subcategories",
          include: [
            {
              model: Item,
              as: "products",
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: Inventory,
                  as: "inventories",
                  attributes: [
                    "current_quantity",
                    "minimum_quantity",
                    "maximum_quantity",
                    "reorder_level",
                  ],
                  // If warehouseId is provided, filter inventories by that warehouse.
                  where: warehouseId
                    ? { warehouse_id: warehouseId }
                    : undefined,
                  required: false,
                  include: [
                    {
                      model: Warehouse,
                      as: "warehouse",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Item,
          as: "products",
          attributes: ["id", "name", "price"],
          include: [
            {
              model: Inventory,
              as: "inventories",
              attributes: [
                "current_quantity",
                "minimum_quantity",
                "maximum_quantity",
                "reorder_level",
              ],
              where: warehouseId ? { warehouse_id: warehouseId } : undefined,
              required: false,
              include: [
                {
                  model: Warehouse,
                  as: "warehouse",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["name", "ASC"],
        [{ model: Subcategory, as: "subcategories" }, "name", "ASC"],
        [
          { model: Subcategory, as: "subcategories" },
          { model: Item, as: "products" },
          "name",
          "ASC",
        ],
        [{ model: Item, as: "products" }, "name", "ASC"],
      ],
    });
    return categories;
  }

  async create(data) {
    return await Category.create(data);
  }

  async getById(id) {
    return await Category.findByPk(id);
  }

  async update(id, categoryData) {
    const category = await Category.findByPk(id);
    if (category) {
      return await category.update(categoryData);
    }
    return null;
  }

  async delete(id) {
    const category = await Category.findByPk(id);
    if (category) {
      return await category.destroy();
    }
    return null;
  }
}

module.exports = new CategoryRepository();
