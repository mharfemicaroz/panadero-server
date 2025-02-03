const db = require("@models");
const CategoryGroup = db.CategoryGroup;
const AbstractRepository = require("@base/AbstractRepository");

class CategoryGroupRepository extends AbstractRepository {
  constructor() {
    super(CategoryGroup);
  }

  async listing() {
    return await CategoryGroup.findAll();
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
