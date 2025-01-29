const { Op } = require("sequelize");
const db = require("../../models");
const Category = db.Category;
const CategoryGroup = db.CategoryGroup;
const Subcategory = db.Subcategory;
const Item = db.Item;
const AbstractRepository = require("../../base/AbstractRepository");

class CategoryRepository extends AbstractRepository {
  constructor() {
    super(Category);
  }

  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit; // Calculate offset for pagination

    const where = {};
    if (filters.name) where.name = { [Op.like]: `%${filters.name}%` }; // Case-insensitive name search
    if (filters.categoryGroupId)
      where.categoryGroupId = filters.categoryGroupId; // Filter by categoryGroupId
    if (filters.is_active !== undefined) where.is_active = filters.is_active; // Filter by active status

    return Category.findAndCountAll({
      where,
      include: { model: CategoryGroup, as: "categoryGroup" },
      order: [[sortBy, sortOrder.toUpperCase()]], // Sorting logic
      limit: parseInt(limit, 10), // Convert limit to integer
      offset,
    });
  }

  async getAllWithProducts() {
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
            },
          ],
        },
        {
          model: Item,
          as: "products",
          attributes: ["id", "name", "price"],
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
