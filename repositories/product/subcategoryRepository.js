const { Op } = require("sequelize");
const db = require("../../models");
const Subcategory = db.Subcategory;
const Category = db.Category;
const AbstractRepository = require("../../base/AbstractRepository");

class SubcategoryRepository extends AbstractRepository {
  constructor() {
    super(Subcategory);
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
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };
    if (filters.is_active !== undefined) where.is_active = filters.is_active;

    return Subcategory.findAndCountAll({
      where,
      include: { model: Category, as: "category" },
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return await Subcategory.create(data);
  }

  async getById(id) {
    return await Subcategory.findByPk(id);
  }

  async update(id, subcategoryData) {
    const subcategory = await Subcategory.findByPk(id);
    if (subcategory) {
      return await subcategory.update(subcategoryData);
    }
    return null;
  }

  async delete(id) {
    const subcategory = await Subcategory.findByPk(id);
    if (subcategory) {
      return await subcategory.destroy();
    }
    return null;
  }
}

module.exports = new SubcategoryRepository();
