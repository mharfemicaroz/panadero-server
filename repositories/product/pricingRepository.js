const { Op } = require("sequelize");
const db = global.requireV2("models");
const Pricing = db.Pricing;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class PricingRepository extends AbstractRepository {
  constructor() {
    super(Pricing);
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
    if (filters.effective_date) where.effective_date = filters.effective_date;
    return Pricing.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [{ association: "item" }],
    });
  }

  async create(data) {
    return Pricing.create(data);
  }

  async getById(id) {
    return Pricing.findByPk(id, { include: [{ association: "item" }] });
  }

  async update(id, data) {
    const record = await Pricing.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await Pricing.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new PricingRepository();
