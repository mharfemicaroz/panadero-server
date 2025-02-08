const { Op } = require("sequelize");
const db = global.requireV2("models");
const CategoryGroup = db.CategoryGroup;

class CategoryGroupRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at", // default sort column
    sortOrder = "DESC", // default sort order
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // Apply filter on name if provided.
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    // Apply filter on is_active if provided.
    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    return await CategoryGroup.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]], // apply sorting here
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return await CategoryGroup.create(data);
  }

  async getById(id) {
    return await CategoryGroup.findByPk(id);
  }

  async update(id, categoryGroupData) {
    const categoryGroup = await CategoryGroup.findByPk(id);
    if (categoryGroup) {
      return await categoryGroup.update(categoryGroupData);
    }
    return null;
  }

  async delete(id) {
    const categoryGroup = await CategoryGroup.findByPk(id);
    if (categoryGroup) {
      return await categoryGroup.destroy();
    }
    return null;
  }
}

module.exports = new CategoryGroupRepository();
