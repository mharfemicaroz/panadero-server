const db = global.requireV2("models");
const Branch = db.Branch;

class BranchRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};
    if (filters.name)
      where.name = { [db.Sequelize.Op.like]: `%${filters.name}%` };
    if (filters.location)
      where.location = { [db.Sequelize.Op.like]: `%${filters.location}%` };
    if (filters.is_active !== undefined) where.is_active = filters.is_active;
    return await Branch.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }
  async create(data) {
    return await Branch.create(data);
  }
  async getById(id) {
    return await Branch.findByPk(id);
  }
  async update(id, data) {
    const branch = await Branch.findByPk(id);
    if (!branch) return null;
    return await branch.update(data);
  }
  async delete(id) {
    const branch = await Branch.findByPk(id);
    if (!branch) return null;
    return await branch.destroy();
  }
}

module.exports = new BranchRepository();
