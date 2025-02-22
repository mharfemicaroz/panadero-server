const db = global.requireV2("models");
const Department = db.Department;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class DepartmentRepository extends AbstractRepository {
  constructor() {
    super(Department);
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

    if (filters.name)
      where.name = { [db.Sequelize.Op.like]: `%${filters.name}%` };

    return Department.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return await Department.create(data);
  }

  async getById(id) {
    return await Department.findByPk(id);
  }

  async update(id, data) {
    const department = await this.getById(id);
    if (!department) return null;
    return await department.update(data);
  }

  async delete(id) {
    const department = await this.getById(id);
    if (!department) return null;
    return await department.destroy();
  }
}

module.exports = new DepartmentRepository();
