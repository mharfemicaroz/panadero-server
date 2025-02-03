const { Op } = require("sequelize");
const db = global.requireV2("models");
const Return = db.Return;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class ReturnRepository extends AbstractRepository {
  constructor() {
    super(Return);
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
    if (filters.order_id) where.order_id = filters.order_id;
    if (filters.item_id) where.item_id = filters.item_id;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.status) where.status = filters.status;
    if (filters.start_date && filters.end_date) {
      where.return_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }
    return Return.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        { association: "order" },
        { association: "item" },
        { association: "warehouse" },
      ],
    });
  }

  async create(data) {
    return Return.create(data);
  }

  async getById(id) {
    return Return.findByPk(id, {
      include: [
        { association: "order" },
        { association: "item" },
        { association: "warehouse" },
      ],
    });
  }

  async update(id, data) {
    const record = await Return.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await Return.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new ReturnRepository();
