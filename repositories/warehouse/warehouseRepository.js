const { Op } = require("sequelize");
const db = require("../../models");
const Warehouse = db.Warehouse;
const AbstractRepository = require("../../base/AbstractRepository");

class WarehouseRepository extends AbstractRepository {
  constructor() {
    super(Warehouse);
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
    if (filters.location)
      where.location = { [Op.like]: `%${filters.location}%` };
    if (filters.is_active !== undefined) where.is_active = filters.is_active;

    return Warehouse.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return await Warehouse.create(data);
  }

  async getById(id) {
    return await Warehouse.findByPk(id);
  }

  async update(id, warehouseData) {
    const warehouse = await Warehouse.findByPk(id);
    if (warehouse) {
      return await warehouse.update(warehouseData);
    }
    return null;
  }

  async delete(id) {
    const warehouse = await Warehouse.findByPk(id);
    if (warehouse) {
      return await warehouse.destroy();
    }
    return null;
  }
}

module.exports = new WarehouseRepository();
