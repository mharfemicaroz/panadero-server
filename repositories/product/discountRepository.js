const { Op } = require("sequelize");
const db = require("@models");
const Discount = db.Discount;
const AbstractRepository = require("@base/AbstractRepository");

class DiscountRepository extends AbstractRepository {
  constructor() {
    super(Discount);
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
    if (filters.item_id) where.item_id = filters.item_id;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;
    if (filters.start_date && filters.end_date) {
      where.start_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }
    return Discount.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [{ association: "item" }],
    });
  }

  async create(data) {
    return Discount.create(data);
  }

  async getById(id) {
    return Discount.findByPk(id, { include: [{ association: "item" }] });
  }

  async update(id, data) {
    const record = await Discount.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await Discount.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new DiscountRepository();
