const { Op } = require("sequelize");
const db = require("../../models");
const Damage = db.Damage;
const AbstractRepository = require("../../base/AbstractRepository");

class DamageRepository extends AbstractRepository {
  constructor() {
    super(Damage);
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
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.status) where.status = filters.status;
    if (filters.start_date && filters.end_date) {
      where.damage_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }
    return Damage.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [{ association: "item" }, { association: "warehouse" }],
    });
  }

  async create(data) {
    return Damage.create(data);
  }

  async getById(id) {
    return Damage.findByPk(id, {
      include: [{ association: "item" }, { association: "warehouse" }],
    });
  }

  async update(id, data) {
    const record = await Damage.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await Damage.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new DamageRepository();
