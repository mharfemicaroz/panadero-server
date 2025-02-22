const db = global.requireV2("models");
const LeaveType = db.LeaveType;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class LeaveTypeRepository extends AbstractRepository {
  constructor() {
    super(LeaveType);
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

    if (filters.is_active !== undefined) where.is_active = filters.is_active;

    return LeaveType.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async getById(id) {
    return LeaveType.findByPk(id);
  }

  async create(data) {
    return LeaveType.create(data);
  }

  async update(id, data) {
    const leaveType = await this.getById(id);
    if (!leaveType) return null;
    return leaveType.update(data);
  }

  async delete(id) {
    const leaveType = await this.getById(id);
    if (!leaveType) return null;
    return leaveType.destroy();
  }
}

module.exports = new LeaveTypeRepository();
