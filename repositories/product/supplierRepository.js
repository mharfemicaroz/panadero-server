const { Op } = require("sequelize");
const db = global.requireV2("models");
const Supplier = db.Supplier;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class SupplierRepository extends AbstractRepository {
  constructor() {
    super(Supplier);
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

    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }
    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    return Supplier.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return Supplier.create(data);
  }

  async getById(id) {
    return Supplier.findByPk(id);
  }

  async update(id, data) {
    const record = await Supplier.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await Supplier.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new SupplierRepository();
