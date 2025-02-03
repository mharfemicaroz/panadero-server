const { Op } = require("sequelize");
const db = require("@models");
const Procurement = db.Procurement;
const AbstractRepository = require("@base/AbstractRepository");

class ProcurementRepository extends AbstractRepository {
  constructor() {
    super(Procurement);
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

    if (filters.supplier_id) where.supplier_id = filters.supplier_id;
    if (filters.item_id) where.item_id = filters.item_id;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.status) where.status = filters.status;
    if (filters.start_date && filters.end_date) {
      where.procurement_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }

    return Procurement.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        { association: "supplier" },
        { association: "item" },
        { association: "warehouse" },
      ],
    });
  }

  async create(data) {
    return Procurement.create(data);
  }

  async getById(id) {
    return Procurement.findByPk(id, {
      include: [
        { association: "supplier" },
        { association: "item" },
        { association: "warehouse" },
      ],
    });
  }

  async update(id, data) {
    const record = await Procurement.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await Procurement.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new ProcurementRepository();
